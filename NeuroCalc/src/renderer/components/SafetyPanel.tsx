import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { createLLMService } from '../utils/llmService';
import { SafetyCheck } from '../types';

const SafetyContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border-left: 4px solid ${props => props.theme.colors.warning};
`;

const SafetyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const SafetyIcon = styled.div<{ level: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  
  ${props => {
    switch (props.level) {
      case 'safe':
        return `
          background: ${props.theme.colors.success};
          color: white;
        `;
      case 'caution':
        return `
          background: ${props.theme.colors.warning};
          color: white;
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.danger};
          color: white;
        `;
      case 'danger':
        return `
          background: #dc2626;
          color: white;
        `;
      default:
        return `
          background: ${props.theme.colors.muted};
          color: white;
        `;
    }
  }}
`;

const SafetyTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const SafetyCheckItem = styled.div<{ level: string }>`
  padding: 12px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid;
  
  ${props => {
    switch (props.level) {
      case 'safe':
        return `
          background: ${props.theme.colors.successLight};
          border-color: ${props.theme.colors.success};
        `;
      case 'caution':
        return `
          background: ${props.theme.colors.warningLight};
          border-color: ${props.theme.colors.warning};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.dangerLight};
          border-color: ${props.theme.colors.danger};
        `;
      case 'danger':
        return `
          background: #fef2f2;
          border-color: #dc2626;
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundHover};
          border-color: ${props.theme.colors.muted};
        `;
    }
  }}
`;

const SafetyMessage = styled.p`
  margin: 0 0 8px 0;
  font-weight: 500;
  line-height: 1.4;
`;

const RecommendationsList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 16px;
  
  li {
    margin: 4px 0;
    line-height: 1.4;
    font-size: 14px;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.dangerLight};
  border: 1px solid ${props => props.theme.colors.danger};
  border-radius: 6px;
  color: ${props => props.theme.colors.danger};
  font-size: 14px;
`;

const BasicWarnings = styled.div`
  margin-top: 8px;
  
  .warning-item {
    padding: 8px 12px;
    margin: 4px 0;
    background: ${props => props.theme.colors.warningLight};
    border-left: 3px solid ${props => props.theme.colors.warning};
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const RefreshButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: auto;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.muted};
    cursor: not-allowed;
  }
`;

export const SafetyPanel: React.FC = () => {
  const { selectedSubstance, currentDosage, currentRoute, llmConfig } = useAppStore();
  const [safetyChecks, setSafetyChecks] = useState<SafetyCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic safety warnings from substance data
  const basicWarnings = useMemo(() => {
    if (!selectedSubstance) return [];
    return selectedSubstance.warnings || [];
  }, [selectedSubstance]);

  // Determine overall safety level
  const overallSafetyLevel = useMemo(() => {
    if (safetyChecks.length === 0) return 'caution';
    
    const levels = safetyChecks.map(check => check.level);
    
    if (levels.includes('danger')) return 'danger';
    if (levels.includes('warning')) return 'warning';
    if (levels.includes('caution')) return 'caution';
    return 'safe';
  }, [safetyChecks]);

  const performSafetyAnalysis = async () => {
    if (!selectedSubstance || !llmConfig.enabled || !llmConfig.endpoint || !llmConfig.apiKey) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const llmService = createLLMService(llmConfig);
      const checks = await llmService.generateSafetyRecommendations(
        selectedSubstance,
        currentDosage,
        currentRoute,
        [] // TODO: Add user history from settings
      );
      
      setSafetyChecks(checks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Safety analysis failed';
      setError(errorMessage);
      console.error('Safety analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger analysis when relevant parameters change
  useEffect(() => {
    if (selectedSubstance && currentDosage > 0) {
      performSafetyAnalysis();
    } else {
      setSafetyChecks([]);
      setError(null);
    }
  }, [selectedSubstance, currentDosage, currentRoute, llmConfig.enabled]);

  if (!selectedSubstance) {
    return null;
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'safe': return '✓';
      case 'caution': return '⚠';
      case 'warning': return '!';
      case 'danger': return '⚠';
      default: return '?';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'safe': return 'Safe';
      case 'caution': return 'Caution';
      case 'warning': return 'Warning';
      case 'danger': return 'Danger';
      default: return 'Unknown';
    }
  };

  return (
    <SafetyContainer>
      <SafetyHeader>
        <SafetyIcon level={overallSafetyLevel}>
          {getLevelIcon(overallSafetyLevel)}
        </SafetyIcon>
        <SafetyTitle>Safety Analysis</SafetyTitle>
        {llmConfig.enabled && (
          <RefreshButton 
            onClick={performSafetyAnalysis} 
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Refresh'}
          </RefreshButton>
        )}
      </SafetyHeader>

      {isLoading && (
        <LoadingIndicator>
          <span>🔄</span>
          Performing AI safety analysis...
        </LoadingIndicator>
      )}

      {error && (
        <ErrorMessage>
          Safety analysis unavailable: {error}
        </ErrorMessage>
      )}

      {/* AI-powered safety checks */}
      {safetyChecks.length > 0 && (
        <div>
          {safetyChecks.map((check, index) => (
            <SafetyCheckItem key={index} level={check.level}>
              <SafetyMessage>
                <strong>{getLevelLabel(check.level)}:</strong> {check.message}
              </SafetyMessage>
              {check.recommendations.length > 0 && (
                <RecommendationsList>
                  {check.recommendations.map((rec, recIndex) => (
                    <li key={recIndex}>{rec}</li>
                  ))}
                </RecommendationsList>
              )}
            </SafetyCheckItem>
          ))}
        </div>
      )}

      {/* Basic warnings from substance data */}
      {basicWarnings.length > 0 && (
        <BasicWarnings>
          <h4 style={{ margin: '12px 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            Known Warnings:
          </h4>
          {basicWarnings.map((warning, index) => (
            <div key={index} className="warning-item">
              {warning}
            </div>
          ))}
        </BasicWarnings>
      )}

      {/* Fallback when no AI analysis available */}
      {!llmConfig.enabled && safetyChecks.length === 0 && (
        <SafetyCheckItem level="caution">
          <SafetyMessage>
            <strong>AI Safety Analysis Disabled:</strong> Enable LLM integration in settings for comprehensive safety recommendations.
          </SafetyMessage>
          <RecommendationsList>
            <li>Always start with the lowest effective dose</li>
            <li>Research substance interactions thoroughly</li>
            <li>Consider your individual health conditions</li>
            <li>Consult healthcare professionals when appropriate</li>
          </RecommendationsList>
        </SafetyCheckItem>
      )}
    </SafetyContainer>
  );
};