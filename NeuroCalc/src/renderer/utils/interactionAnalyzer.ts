import { Substance, InteractionWarning } from '../types';

export interface InteractionRule {
  id: string;
  substance1Pattern: string;
  substance2Pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'synergistic' | 'antagonistic' | 'dangerous' | 'contraindicated';
  description: string;
  mechanism: string;
  recommendation: string;
}

export interface InteractionResult {
  warnings: InteractionWarning[];
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
}

class InteractionAnalyzer {
  private static rules: InteractionRule[] = [
    {
      id: 'maoi-serotonin',
      substance1Pattern: 'MAOI|harmine|harmaline|syrian rue',
      substance2Pattern: 'MDMA|5-MeO-DMT|DMT|psilocybin',
      severity: 'critical',
      type: 'dangerous',
      description: 'MAOI + Serotonergic combinations can cause serotonin syndrome',
      mechanism: 'MAO inhibition prevents serotonin breakdown, leading to dangerous accumulation',
      recommendation: 'Avoid combination entirely. Wait 2+ weeks between substances.'
    },
    {
      id: 'stimulant-depressant',
      substance1Pattern: 'cocaine|amphetamine|caffeine|modafinil',
      substance2Pattern: 'alcohol|benzodiazepine|opioid|barbiturate',
      severity: 'high',
      type: 'dangerous',
      description: 'Stimulant-depressant combinations mask warning signs',
      mechanism: 'Opposing effects can hide overdose symptoms from either substance',
      recommendation: 'Use extreme caution. Avoid high doses of either substance.'
    },
    {
      id: 'psychedelic-synergy',
      substance1Pattern: 'LSD|psilocybin|mescaline',
      substance2Pattern: 'LSD|psilocybin|mescaline|DMT',
      severity: 'medium',
      type: 'synergistic',
      description: 'Psychedelic combinations can be intensely synergistic',
      mechanism: '5-HT2A receptor agonism compounds exponentially',
      recommendation: 'Reduce dosages significantly. Start with 1/3 normal dose of each.'
    },
    {
      id: 'cannabis-psychedelic',
      substance1Pattern: 'THC|cannabis|marijuana',
      substance2Pattern: 'LSD|psilocybin|DMT|mescaline',
      severity: 'medium',
      type: 'synergistic',
      description: 'Cannabis can intensify and prolong psychedelic experiences',
      mechanism: 'CB1 receptor activation modulates serotonergic pathways',
      recommendation: 'Use cannabis sparingly during psychedelic experiences.'
    },
    {
      id: 'alcohol-depressant',
      substance1Pattern: 'alcohol|ethanol',
      substance2Pattern: 'benzodiazepine|barbiturate|opioid|GHB',
      severity: 'critical',
      type: 'dangerous',
      description: 'Alcohol + CNS depressants cause respiratory depression',
      mechanism: 'Additive GABA-A agonism and respiratory depression',
      recommendation: 'Never combine. Potentially fatal.'
    },
    {
      id: 'caffeine-stimulant',
      substance1Pattern: 'caffeine',
      substance2Pattern: 'amphetamine|cocaine|MDMA|modafinil',
      severity: 'medium',
      type: 'synergistic',
      description: 'Caffeine increases cardiovascular strain from stimulants',
      mechanism: 'Adenosine antagonism compounds dopaminergic stimulation',
      recommendation: 'Limit caffeine intake. Monitor heart rate and blood pressure.'
    }
  ];

  static analyzeInteractions(substances: (Substance | null)[]): InteractionResult {
    const validSubstances = substances.filter((s): s is Substance => s !== null);
    const warnings: InteractionWarning[] = [];
    const risks: string[] = [];

    // Check pairwise interactions
    for (let i = 0; i < validSubstances.length; i++) {
      for (let j = i + 1; j < validSubstances.length; j++) {
        const substance1 = validSubstances[i];
        const substance2 = validSubstances[j];
        
        const pairWarnings = this.checkPairInteraction(substance1, substance2);
        warnings.push(...pairWarnings);
        
        risks.push(...pairWarnings.map(w => w.severity));
      }
    }

    // Check mechanism-based interactions
    const mechanismWarnings = this.analyzeMechanismInteractions(validSubstances);
    warnings.push(...mechanismWarnings);
    risks.push(...mechanismWarnings.map(w => w.severity));

    // Determine overall risk level
    const overallRisk = this.calculateOverallRisk(risks);
    
    // Generate recommendations
    const recommendedActions = this.generateRecommendations(warnings, validSubstances);

    return {
      warnings,
      overallRisk,
      recommendedActions
    };
  }

  private static checkPairInteraction(substance1: Substance, substance2: Substance): InteractionWarning[] {
    const warnings: InteractionWarning[] = [];

    for (const rule of this.rules) {
      const regex1 = new RegExp(rule.substance1Pattern, 'i');
      const regex2 = new RegExp(rule.substance2Pattern, 'i');

      const match1 = regex1.test(substance1.name) || regex1.test(substance1.class);
      const match2 = regex2.test(substance2.name) || regex2.test(substance2.class);

      if ((match1 && regex2.test(substance2.name)) || (match2 && regex1.test(substance1.name))) {
        warnings.push({
          id: `${rule.id}-${substance1.id}-${substance2.id}`,
          substances: [substance1.id, substance2.id],
          severity: rule.severity,
          type: rule.type,
          title: `${substance1.name} + ${substance2.name}`,
          description: rule.description,
          mechanism: rule.mechanism,
          recommendation: rule.recommendation,
          timestamp: Date.now()
        });
      }
    }

    return warnings;
  }

  private static analyzeMechanismInteractions(substances: Substance[]): InteractionWarning[] {
    const warnings: InteractionWarning[] = [];
    const mechanisms = new Map<string, Substance[]>();

    // Group substances by primary mechanism
    substances.forEach(substance => {
      if (substance.neurotransmitters) {
        Object.keys(substance.neurotransmitters).forEach(nt => {
          if (!mechanisms.has(nt)) {
            mechanisms.set(nt, []);
          }
          mechanisms.get(nt)!.push(substance);
        });
      }
    });

    // Check for dangerous mechanism combinations
    const serotoninSubstances = mechanisms.get('serotonin') || [];
    const dopamineSubstances = mechanisms.get('dopamine') || [];
    const gabaSubstances = mechanisms.get('gaba') || [];

    // Multiple serotonergic substances
    if (serotoninSubstances.length > 1) {
      warnings.push({
        id: `serotonin-multiple-${Date.now()}`,
        substances: serotoninSubstances.map(s => s.id),
        severity: 'high',
        type: 'dangerous',
        title: 'Multiple Serotonergic Substances',
        description: 'Combining multiple substances affecting serotonin increases risk of serotonin syndrome',
        mechanism: 'Excessive 5-HT receptor activation and reuptake inhibition',
        recommendation: 'Consider reducing dosages or spacing administration times',
        timestamp: Date.now()
      });
    }

    // Multiple GABA depressants
    if (gabaSubstances.length > 1) {
      warnings.push({
        id: `gaba-multiple-${Date.now()}`,
        substances: gabaSubstances.map(s => s.id),
        severity: 'critical',
        type: 'dangerous',
        title: 'Multiple GABA Depressants',
        description: 'Combining multiple GABA-affecting substances can cause respiratory depression',
        mechanism: 'Additive GABAergic CNS depression',
        recommendation: 'Use extreme caution. Consider avoiding combination entirely',
        timestamp: Date.now()
      });
    }

    return warnings;
  }

  private static calculateOverallRisk(risks: string[]): 'low' | 'medium' | 'high' | 'critical' {
    if (risks.includes('critical')) return 'critical';
    if (risks.includes('high')) return 'high';
    if (risks.includes('medium')) return 'medium';
    return 'low';
  }

  private static generateRecommendations(warnings: InteractionWarning[], substances: Substance[]): string[] {
    const recommendations: string[] = [];

    if (warnings.some(w => w.severity === 'critical')) {
      recommendations.push('🚨 CRITICAL: Avoid this combination entirely');
      recommendations.push('Consider using only one substance or spacing them by weeks');
    }

    if (warnings.some(w => w.severity === 'high')) {
      recommendations.push('⚠️ HIGH RISK: Use extreme caution if proceeding');
      recommendations.push('Significantly reduce dosages of all substances');
      recommendations.push('Have emergency contacts and naloxone/benzos available');
    }

    if (warnings.some(w => w.type === 'synergistic')) {
      recommendations.push('📈 SYNERGY DETECTED: Effects will be amplified');
      recommendations.push('Start with 25-50% of normal dosages');
      recommendations.push('Allow extra time between dosing');
    }

    if (substances.length > 2) {
      recommendations.push('🔢 MULTIPLE SUBSTANCES: Interactions increase exponentially');
      recommendations.push('Consider simplifying to fewer substances');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Low interaction risk detected');
      recommendations.push('Still recommend starting with lower doses');
      recommendations.push('Monitor for unexpected effects');
    }

    return recommendations;
  }

  static getInteractionTypes(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'synergistic', label: 'Synergistic', color: '#ff9800' },
      { value: 'antagonistic', label: 'Antagonistic', color: '#2196f3' },
      { value: 'dangerous', label: 'Dangerous', color: '#f44336' },
      { value: 'contraindicated', label: 'Contraindicated', color: '#9c27b0' }
    ];
  }

  static getSeverityLevels(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'low', label: 'Low Risk', color: '#4caf50' },
      { value: 'medium', label: 'Medium Risk', color: '#ff9800' },
      { value: 'high', label: 'High Risk', color: '#ff5722' },
      { value: 'critical', label: 'Critical Risk', color: '#f44336' }
    ];
  }
}

export default InteractionAnalyzer;