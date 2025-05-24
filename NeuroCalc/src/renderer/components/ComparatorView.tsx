import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import SubstancePanel from './comparator/SubstancePanel';
import ComparisonControls from './comparator/ComparisonControls';
import { Substance, ComparisonExportOptions, DetailedSubstanceComparison } from '../types';
import ComparisonCalculator from '../utils/comparisonCalculator';

const ComparatorContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 100%;
    padding: 16px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 12px;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 12px 0;
    margin-bottom: 16px;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 6px;
    max-width: 100%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const ProgressStep = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => 
    props.completed 
      ? props.theme.colors.accent[500]
      : props.active 
        ? props.theme.colors.primary[100]
        : props.theme.colors.gray[100]
  };
  color: ${props => 
    props.completed 
      ? props.theme.colors.text.inverse
      : props.active 
        ? props.theme.colors.primary[700]
        : props.theme.colors.text.secondary
  };
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.fast};
  border: 2px solid ${props => 
    props.completed 
      ? props.theme.colors.accent[500]
      : props.active 
        ? props.theme.colors.primary[400]
        : props.theme.colors.gray[200]
  };
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 6px 12px;
    font-size: ${props => props.theme.typography.fontSize.xs};
    gap: 6px;
  }
`;

const ProgressConnector = styled.div<{ completed?: boolean }>`
  width: 24px;
  height: 2px;
  background: ${props => 
    props.completed 
      ? props.theme.colors.accent[500]
      : props.theme.colors.gray[200]
  };
  transition: all ${props => props.theme.transitions.fast};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    order: 10;
    margin: 4px 0;
  }
`;

const StepIcon = styled.span`
  font-size: 14px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;

const ComparatorHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 12px 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const ComparisonLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    gap: 20px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const SwapButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.primary[400]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  font-size: 20px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[100]};
    transform: rotate(180deg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    align-self: stretch;
    border-radius: ${props => props.theme.borderRadius.md};
    width: auto;
    height: 40px;
    
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text.secondary};
  border: 2px dashed ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 24px 16px;
    min-height: 150px;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 36px;
    margin-bottom: 12px;
  }
`;

const EmptyStateText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  margin: 0 0 8px 0;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const EmptyStateHint = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
  font-style: italic;
  opacity: 0.7;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

const ResultsSection = styled.div`
  margin-top: 40px;
  grid-column: 1 / -1;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 24px;
  }
`;

const ResultsTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 20px 0;
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin-bottom: 16px;
  }
`;

const ResultsCard = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 16px;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ResultItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const ComparatorView: React.FC = () => {
  const { 
    comparison: { 
      selectedSubstances: [primarySubstance, secondarySubstance],
      activeDosages,
      activeRoute 
    },
    setComparisonSubstance,
    setComparisonDosage,
    setComparisonRoute,
    swapComparisonSubstances,
    resetComparison,
  } = useAppStore();

  const [isCalculating, setIsCalculating] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<DetailedSubstanceComparison | null>(null);
  const [calculationError, setCalculationError] = useState<string | undefined>();

  const handleSubstanceChange = useCallback((index: 0 | 1, substance: Substance | null) => {
    setComparisonSubstance(index, substance);
    setComparisonResult(null);
    setCalculationError(undefined);
  }, [setComparisonSubstance]);

  const handleDosageChange = useCallback((index: 0 | 1, dosage: number) => {
    const substance = index === 0 ? primarySubstance : secondarySubstance;
    if (substance) {
      setComparisonDosage(substance.id, dosage);
      setComparisonResult(null);
    }
  }, [setComparisonDosage, primarySubstance, secondarySubstance]);

  const handleRouteChange = useCallback((route: string) => {
    setComparisonRoute(route);
    setComparisonResult(null);
  }, [setComparisonRoute]);

  const handleSwap = useCallback(() => {
    swapComparisonSubstances();
    setComparisonResult(null);
  }, [swapComparisonSubstances]);

  const handleReset = useCallback(() => {
    resetComparison();
    setComparisonResult(null);
    setCalculationError(undefined);
  }, [resetComparison]);

  const handleCalculate = useCallback(async () => {
    if (!primarySubstance || !secondarySubstance) return;
    
    setIsCalculating(true);
    setCalculationError(undefined);
    
    try {
      const result = await ComparisonCalculator.calculateComparison(
        primarySubstance,
        activeDosages[primarySubstance.id] || 50,
        activeRoute,
        secondarySubstance,
        activeDosages[secondarySubstance.id] || 50,
        activeRoute
      );
      
      if (result.success && result.comparison) {
        setComparisonResult(result.comparison);
      } else {
        setCalculationError(result.error || 'Calculation failed');
      }
    } catch (error) {
      setCalculationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsCalculating(false);
    }
  }, [primarySubstance, secondarySubstance, activeDosages, activeRoute]);

  const handleExport = useCallback((options: ComparisonExportOptions) => {
    if (!comparisonResult) return;
    
    console.log('Export comparison:', options);
    
    const data = {
      comparison: comparisonResult,
      options,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${Date.now()}.${options.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [comparisonResult]);

  const getProgressStep = () => {
    if (!primarySubstance && !secondarySubstance) return 0;
    if (!primarySubstance || !secondarySubstance) return 1;
    if (!comparisonResult && !isCalculating) return 2;
    return 3;
  };

  const currentStep = getProgressStep();

  return (
    <ComparatorContainer>
      <ComparatorHeader>
        <Title>Substance Comparator</Title>
        <Subtitle>
          Compare the neurotransmitter effects of two substances side-by-side
        </Subtitle>
      </ComparatorHeader>

      <ProgressContainer>
        <ProgressBar>
          <ProgressStep completed={currentStep > 0} active={currentStep === 0}>
            <StepIcon>🔍</StepIcon>
            Select Substances
          </ProgressStep>
          <ProgressConnector completed={currentStep > 1} />
          <ProgressStep completed={currentStep > 1} active={currentStep === 1}>
            <StepIcon>⚖️</StepIcon>
            Configure Dosages
          </ProgressStep>
          <ProgressConnector completed={currentStep > 2} />
          <ProgressStep completed={currentStep > 2} active={currentStep === 2}>
            <StepIcon>🧮</StepIcon>
            Calculate Comparison
          </ProgressStep>
          <ProgressConnector completed={currentStep > 3} />
          <ProgressStep completed={currentStep > 3} active={currentStep === 3}>
            <StepIcon>📊</StepIcon>
            View Results
          </ProgressStep>
        </ProgressBar>
      </ProgressContainer>

      <ComparisonControls
        primarySubstance={primarySubstance}
        secondarySubstance={secondarySubstance}
        isCalculating={isCalculating}
        hasResults={!!comparisonResult}
        onSwap={handleSwap}
        onReset={handleReset}
        onExport={handleExport}
        onCalculate={handleCalculate}
        calculationError={calculationError}
      />

      <ComparisonLayout>
        <SubstancePanel
          position="left"
          substance={primarySubstance}
          dosage={activeDosages[primarySubstance?.id || ''] || 50}
          route={activeRoute}
          onSubstanceChange={(substance) => handleSubstanceChange(0, substance)}
          onDosageChange={(dosage) => handleDosageChange(0, dosage)}
          onRouteChange={handleRouteChange}
        />

        <SwapButton onClick={handleSwap} disabled={!primarySubstance || !secondarySubstance}>
          ⇄
        </SwapButton>

        <SubstancePanel
          position="right"
          substance={secondarySubstance}
          dosage={activeDosages[secondarySubstance?.id || ''] || 50}
          route={activeRoute}
          onSubstanceChange={(substance) => handleSubstanceChange(1, substance)}
          onDosageChange={(dosage) => handleDosageChange(1, dosage)}
          onRouteChange={handleRouteChange}
        />
      </ComparisonLayout>

      <ResultsSection>
        <ResultsTitle>Comparison Results</ResultsTitle>
        {comparisonResult ? (
          <ResultsCard>
            <h3 style={{ margin: '0 0 16px 0', color: '#212529' }}>Comparison Complete!</h3>
            <ResultsGrid>
              <ResultItem>
                <strong>Primary:</strong> {comparisonResult.primary.substance.name}<br/>
                <strong>Dosage:</strong> {comparisonResult.primary.dosage}{comparisonResult.primary.unit}<br/>
                <strong>Route:</strong> {comparisonResult.primary.route}
              </ResultItem>
              <ResultItem>
                <strong>Secondary:</strong> {comparisonResult.secondary.substance.name}<br/>
                <strong>Dosage:</strong> {comparisonResult.secondary.dosage}{comparisonResult.secondary.unit}<br/>
                <strong>Route:</strong> {comparisonResult.secondary.route}
              </ResultItem>
              <ResultItem>
                <strong>Similarity:</strong> {(comparisonResult.comparison.effectSimilarity * 100).toFixed(1)}%<br/>
                <strong>Risk Level:</strong> {comparisonResult.comparison.riskProfile.overallRisk}<br/>
                <strong>Interactions:</strong> {comparisonResult.comparison.riskProfile.riskFactors.interactions > 0.5 ? 'High' : 'Low'}
              </ResultItem>
            </ResultsGrid>
          </ResultsCard>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📊</EmptyStateIcon>
            <EmptyStateText>
              {isCalculating ? 'Calculating Comparison...' : 'No Comparison Available'}
            </EmptyStateText>
            <EmptyStateHint>
              {isCalculating 
                ? 'Please wait while we analyze the neurotransmitter interactions'
                : 'Select both substances and click "Compare" to see detailed analysis'
              }
            </EmptyStateHint>
          </EmptyState>
        )}
      </ResultsSection>
    </ComparatorContainer>
  );
};

export default ComparatorView;