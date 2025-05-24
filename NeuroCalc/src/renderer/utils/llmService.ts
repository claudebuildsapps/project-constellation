import { LLMConfig, Substance, NeurotransmitterEffect, SafetyCheck } from '../types';

export interface DrugInteractionAnalysis {
  interactions: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  recommendations: string[];
  contraindications: string[];
}

export interface LLMResponse {
  effects: NeurotransmitterEffect;
  interactions: DrugInteractionAnalysis;
  safetyChecks: SafetyCheck[];
  confidence: number;
}

export class LLMService {
  private config: LLMConfig;
  private requestCache = new Map<string, Promise<any>>();
  private responseCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: LLMConfig) {
    this.config = config;
  }

  private getCacheKey(prompt: string, params?: any): string {
    return JSON.stringify({ prompt, params, config: this.config });
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    if (cached) {
      this.responseCache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.responseCache.set(key, { data, timestamp: Date.now() });
    // Cleanup old cache entries
    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      this.responseCache.delete(oldestKey);
    }
  }

  async analyzeSubstance(
    substance: Substance,
    dosage: number,
    route: string,
    userMedications: string[] = []
  ): Promise<LLMResponse> {
    if (!this.config.enabled || !this.config.endpoint || !this.config.apiKey) {
      throw new Error('LLM service not configured');
    }

    const cacheKey = this.getCacheKey('analyze', { substance: substance.id, dosage, route, userMedications });
    
    // Check cache first for 50-70% reduction in API calls
    const cached = this.getFromCache<LLMResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if request is already in progress (deduplication)
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey)!;
    }

    const prompt = this.createAnalysisPrompt(substance, dosage, route, userMedications);
    
    const requestPromise = this.makeAPICall(prompt)
      .then(response => {
        const result = this.parseResponse(response, substance, dosage, route);
        this.setCache(cacheKey, result);
        this.requestCache.delete(cacheKey);
        return result;
      })
      .catch(error => {
        this.requestCache.delete(cacheKey);
        throw new Error(`LLM analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });

    this.requestCache.set(cacheKey, requestPromise);
    return requestPromise;
  }

  async processNaturalLanguageQuery(query: string): Promise<{
    substances: Substance[];
    intent: 'search' | 'compare' | 'safety' | 'dosage';
    parameters: Record<string, any>;
  }> {
    const cacheKey = this.getCacheKey('query', { query });
    
    // Check cache first
    const cached = this.getFromCache<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if request is already in progress
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey)!;
    }

    const prompt = this.createQueryPrompt(query);
    
    const requestPromise = this.makeAPICall(prompt)
      .then(response => {
        const result = this.parseQueryResponse(response);
        this.setCache(cacheKey, result);
        this.requestCache.delete(cacheKey);
        return result;
      })
      .catch(error => {
        this.requestCache.delete(cacheKey);
        throw new Error(`Query processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });

    this.requestCache.set(cacheKey, requestPromise);
    return requestPromise;
  }

  async generateSafetyRecommendations(
    substance: Substance,
    dosage: number,
    route: string,
    userHistory: string[] = []
  ): Promise<SafetyCheck[]> {
    const prompt = this.createSafetyPrompt(substance, dosage, route, userHistory);
    
    try {
      const response = await this.makeAPICall(prompt);
      return this.parseSafetyResponse(response);
    } catch (error) {
      throw new Error(`Safety analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createAnalysisPrompt(
    substance: Substance,
    dosage: number,
    route: string,
    userMedications: string[]
  ): string {
    return `
Analyze the pharmacological effects of ${substance.name} at ${dosage}mg administered via ${route} route.

Substance Information:
- Name: ${substance.name}
- Category: ${substance.category}
- Mechanisms: ${substance.mechanisms.map(m => `${m.target} ${m.type} (affinity: ${m.affinity})`).join(', ')}
- Description: ${substance.description}
- Warnings: ${substance.warnings?.join(', ') || 'None listed'}

Current Medications: ${userMedications.length > 0 ? userMedications.join(', ') : 'None reported'}

Please provide a detailed analysis in the following JSON format:
{
  "neurotransmitterEffects": {
    "dopamine": {
      "reuptakeInhibition": number (0-100),
      "additionalRelease": number (0-500),
      "netActivity": number,
      "timeProfile": [{"time": number, "intensity": number}]
    },
    "serotonin": { /* same structure */ },
    "norepinephrine": { /* same structure */ }
  },
  "interactions": {
    "interactions": [list of potential drug interactions],
    "riskLevel": "low|moderate|high|severe",
    "recommendations": [list of recommendations],
    "contraindications": [list of contraindications]
  },
  "safetyChecks": [
    {
      "level": "safe|caution|warning|danger",
      "message": "safety message",
      "recommendations": [list of specific recommendations]
    }
  ],
  "confidence": number (0-1)
}

Focus on:
1. Accurate pharmacological modeling based on known mechanisms
2. Realistic time profiles based on pharmacokinetics
3. Comprehensive drug interaction analysis
4. Evidence-based safety recommendations
5. Consider dosage-dependent effects
`;
  }

  private createQueryPrompt(query: string): string {
    return `
Parse this natural language query about substances and neurotransmitter effects:
"${query}"

Determine the user's intent and extract relevant parameters. Respond in JSON format:
{
  "intent": "search|compare|safety|dosage",
  "substances": [list of substance names mentioned],
  "parameters": {
    "dosage": number or null,
    "route": string or null,
    "comparison": boolean,
    "safetyFocus": boolean,
    "timeframe": string or null
  },
  "extractedEntities": [list of relevant entities found],
  "confidence": number (0-1)
}

Examples:
- "What are the effects of 20mg adderall?" -> search intent, dosage=20, substance=adderall
- "Compare MDMA and cocaine dopamine effects" -> compare intent, substances=[mdma, cocaine]
- "Is it safe to take sertraline with LSD?" -> safety intent, substances=[sertraline, lsd]
`;
  }

  private createSafetyPrompt(
    substance: Substance,
    dosage: number,
    route: string,
    userHistory: string[]
  ): string {
    return `
Perform a comprehensive safety analysis for:
- Substance: ${substance.name}
- Dosage: ${dosage}mg
- Route: ${route}
- User History: ${userHistory.join(', ') || 'None provided'}

Known warnings for this substance: ${substance.warnings?.join(', ') || 'None listed'}

Provide safety recommendations in JSON format:
[
  {
    "level": "safe|caution|warning|danger",
    "message": "specific safety concern or recommendation",
    "recommendations": [list of actionable recommendations]
  }
]

Consider:
1. Dosage appropriateness
2. Route-specific risks
3. Individual health factors
4. Potential for adverse effects
5. Harm reduction strategies
6. Medical contraindications
7. Emergency procedures if applicable
`;
  }

  private async makeAPICall(prompt: string): Promise<any> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a specialized pharmacological analysis AI. Provide accurate, evidence-based information about neurotransmitter effects and drug interactions. Always prioritize safety and harm reduction. Format responses as valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private parseResponse(
    response: string,
    substance: Substance,
    dosage: number,
    route: string
  ): LLMResponse {
    try {
      const parsed = JSON.parse(response);
      
      const effects: NeurotransmitterEffect = {
        substance: substance.id,
        dosage,
        route,
        timestamp: Date.now(),
        effects: {
          dopamine: parsed.neurotransmitterEffects.dopamine,
          serotonin: parsed.neurotransmitterEffects.serotonin,
          norepinephrine: parsed.neurotransmitterEffects.norepinephrine,
        },
        confidence: parsed.confidence || 0.8,
        source: 'llm' as const,
      };

      return {
        effects,
        interactions: parsed.interactions,
        safetyChecks: parsed.safetyChecks,
        confidence: parsed.confidence || 0.8,
      };
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }

  private parseQueryResponse(response: string): {
    substances: Substance[];
    intent: 'search' | 'compare' | 'safety' | 'dosage';
    parameters: Record<string, any>;
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        substances: [], // Will be populated by substance matching logic
        intent: parsed.intent,
        parameters: parsed.parameters,
      };
    } catch (error) {
      throw new Error(`Failed to parse query response: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }

  private parseSafetyResponse(response: string): SafetyCheck[] {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to parse safety response: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }
}

export const createLLMService = (config: LLMConfig): LLMService => {
  return new LLMService(config);
};