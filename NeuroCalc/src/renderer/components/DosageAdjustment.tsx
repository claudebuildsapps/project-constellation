import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { createLLMService } from '../utils/llmService';
import { Substance, SafetyCheck } from '../types';

const AdjustmentContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.backgroundHover};
  }
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const RecommendationCard = styled.div<{ type: 'decrease' | 'current' | 'increase' }>`
  padding: 12px;
  border-radius: 6px;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s;

  ${props => {
    switch (props.type) {
      case 'decrease':
        return `
          border-color: ${props.theme.colors.info};
          background: ${props.theme.colors.infoLight};
          &:hover { background: ${props.theme.colors.info}20; }
        `;
      case 'current':
        return `
          border-color: ${props.theme.colors.success};
          background: ${props.theme.colors.successLight};
          &:hover { background: ${props.theme.colors.success}20; }
        `;
      case 'increase':
        return `
          border-color: ${props.theme.colors.warning};
          background: ${props.theme.colors.warningLight};
          &:hover { background: ${props.theme.colors.warning}20; }
        `;
    }
  }}
`;

const DosageValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const DosageLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const RecommendationReason = styled.div`
  font-size: 11px;
  line-height: 1.4;
  opacity: 0.9;
`;

const AIRecommendation = styled.div`
  background: ${props => props.theme.colors.infoLight};
  border: 1px solid ${props => props.theme.colors.info};
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
`;

const AITitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
`;

const AIContent = styled.div`
  font-size: 13px;
  line-height: 1.4;
  
  ul {
    margin: 8px 0;
    padding-left: 16px;
  }
  
  li {
    margin: 4px 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.dangerLight};
  border: 1px solid ${props => props.theme.colors.danger};
  border-radius: 6px;
  color: ${props => props.theme.colors.danger};
  font-size: 13px;
`;

interface DosageRecommendation {
  dosage: number;
  type: 'decrease' | 'current' | 'increase';
  label: string;
  reason: string;
  safety: 'safe' | 'caution' | 'warning' | 'danger';
}

interface AIRecommendationData {
  suggestions: string[];
  reasoning: string;
  warnings: string[];
  confidence: number;
}

export const DosageAdjustment: React.FC = () => {
  const { 
    selectedSubstance, 
    currentDosage, 
    currentRoute, 
    currentUnit, 
    llmConfig, 
    setDosage 
  } = useAppStore();
  
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState<AIRecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDosageSafety = (dosage: number, range: any): 'safe' | 'caution' | 'warning' | 'danger' => {
    if (dosage <= range.light) return 'safe';
    if (dosage <= range.common) return 'safe';
    if (dosage <= range.strong) return 'caution';
    if (dosage <= range.heavy) return 'warning';
    return 'danger';
  };

  // Generate basic dosage recommendations based on substance data
  const basicRecommendations = useMemo((): DosageRecommendation[] => {
    if (!selectedSubstance) return [];

    const range = selectedSubstance.dosageRanges.find(r => r.route === currentRoute);
    if (!range) return [];

    const recommendations: DosageRecommendation[] = [];

    // Current dosage
    recommendations.push({
      dosage: currentDosage,
      type: 'current',
      label: 'Current',
      reason: `Your selected dose`,
      safety: getDosageSafety(currentDosage, range)
    });

    // Decrease suggestion
    if (currentDosage > range.threshold) {
      const decreasedDose = Math.max(range.threshold, Math.round(currentDosage * 0.75));
      recommendations.push({
        dosage: decreasedDose,
        type: 'decrease',
        label: 'Lower',
        reason: `Reduce to minimize risk`,
        safety: getDosageSafety(decreasedDose, range)
      });
    }

    // Increase suggestion (with caution)
    if (currentDosage < range.heavy) {
      const increasedDose = Math.min(range.heavy, Math.round(currentDosage * 1.25));
      if (increasedDose > currentDosage) {
        recommendations.push({
          dosage: increasedDose,
          type: 'increase',
          label: 'Higher',
          reason: `Increase with caution`,
          safety: getDosageSafety(increasedDose, range)
        });
      }
    }

    return recommendations;
  }, [selectedSubstance, currentDosage, currentRoute]);

  const generateAIRecommendation = async () => {
    if (!selectedSubstance || !llmConfig.enabled || !llmConfig.endpoint || !llmConfig.apiKey) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const llmService = createLLMService(llmConfig);
      
      // Create a specialized prompt for dosage adjustment
      const prompt = `
Provide intelligent dosage adjustment recommendations for:
- Substance: ${selectedSubstance.name}
- Current Dose: ${currentDosage}${currentUnit} via ${currentRoute}
- Category: ${selectedSubstance.category}
- Known Mechanisms: ${selectedSubstance.mechanisms.map(m => `${m.target} ${m.type}`).join(', ')}

Consider:
1. Individual tolerance and sensitivity
2. Risk-benefit optimization
3. Harm reduction principles
4. Pharmacokinetic factors
5. Potential for adverse effects

Respond in JSON format:
{
  "suggestions": [
    "Specific dosage adjustment recommendations",
    "Alternative dosing strategies",
    "Timing considerations"
  ],
  "reasoning": "Detailed explanation of recommendations",
  "warnings": [
    "Important safety considerations",
    "Risk factors to monitor"
  ],
  "confidence": number (0-1)
}

Focus on evidence-based recommendations that prioritize user safety.
`;

      const response = await fetch(llmConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: llmConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a specialized pharmacological advisor. Provide safe, evidence-based dosage recommendations with comprehensive safety considerations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: llmConfig.temperature,
          max_tokens: llmConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);
      setAIRecommendation(aiResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI recommendation failed';
      setError(errorMessage);
      console.error('AI dosage recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAIRecommendations && selectedSubstance && currentDosage > 0) {
      generateAIRecommendation();
    }
  }, [showAIRecommendations, selectedSubstance, currentDosage, currentRoute]);

  if (!selectedSubstance) {
    return null;
  }

  const handleDosageSelect = (dosage: number) => {
    setDosage(dosage);
  };

  return (
    <AdjustmentContainer>
      <SectionHeader>
        <SectionTitle>
          🎯 Dosage Recommendations
        </SectionTitle>
        {llmConfig.enabled && (
          <ToggleButton
            active={showAIRecommendations}
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
          >
            AI Analysis
          </ToggleButton>
        )}
      </SectionHeader>

      <RecommendationGrid>
        {basicRecommendations.map((rec, index) => (
          <RecommendationCard
            key={index}
            type={rec.type}
            onClick={() => handleDosageSelect(rec.dosage)}
          >
            <DosageValue>{rec.dosage}{currentUnit}</DosageValue>
            <DosageLabel>{rec.label}</DosageLabel>
            <RecommendationReason>{rec.reason}</RecommendationReason>
          </RecommendationCard>
        ))}
      </RecommendationGrid>

      {showAIRecommendations && (
        <>
          {isLoading && (
            <LoadingSpinner>
              🔄 Generating AI-powered dosage recommendations...
            </LoadingSpinner>
          )}

          {error && (
            <ErrorMessage>
              AI recommendations unavailable: {error}
            </ErrorMessage>
          )}

          {aiRecommendation && (
            <AIRecommendation>
              <AITitle>
                🤖 AI Dosage Analysis
                <span style={{ fontSize: '11px', opacity: 0.7 }}>
                  (Confidence: {Math.round(aiRecommendation.confidence * 100)}%)
                </span>
              </AITitle>
              
              <AIContent>
                <div>
                  <strong>Recommendations:</strong>
                  <ul>
                    {aiRecommendation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Reasoning:</strong> {aiRecommendation.reasoning}
                </div>

                {aiRecommendation.warnings.length > 0 && (
                  <div>
                    <strong>Safety Considerations:</strong>
                    <ul>
                      {aiRecommendation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AIContent>
            </AIRecommendation>
          )}
        </>
      )}
    </AdjustmentContainer>
  );
};