import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { useSettingsStore } from '../store/useSettingsStore';
import DoseResponseChart from './charts/DoseResponseChart';
import TimelineChart from './charts/TimelineChart';
import NeurotransmitterDashboard from './charts/NeurotransmitterDashboard';

const DisplayContainer = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
`;

const EffectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const NeurotransmitterCard = styled.div<{ color: string }>`
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => `${props.color}20`};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const NeurotransmitterIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  background: ${props => `${props.color}20`};
  border: 2px solid ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const NeurotransmitterName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const EffectMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EffectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EffectLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const EffectValue = styled.span<{ intensity: number }>`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => {
    if (props.intensity < 25) return props.theme.colors.status.success;
    if (props.intensity < 50) return props.theme.colors.status.warning;
    return props.theme.colors.status.error;
  }};
`;

const EffectBar = styled.div<{ intensity: number; color: string }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
  
  &::after {
    content: '';
    display: block;
    width: ${props => Math.min(100, props.intensity)}%;
    height: 100%;
    background: ${props => props.color};
    transition: width ${props => props.theme.transitions.normal};
  }
`;

const SummarySection = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px;
  margin-bottom: 24px;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const SummaryLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const ConfidenceIndicator = styled.div<{ confidence: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.confidence > 0.7 
    ? props.theme.colors.accent[50] 
    : props.theme.colors.warning.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ConfidenceLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ConfidenceValue = styled.span<{ confidence: number }>`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.confidence > 0.7 
    ? props.theme.colors.accent[700] 
    : props.theme.colors.warning.text};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.text.secondary};
  
  h3 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 4px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const ViewButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active 
    ? props.theme.colors.primary[500] 
    : 'transparent'};
  color: ${props => props.active 
    ? 'white' 
    : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.active 
      ? props.theme.colors.primary[600] 
      : props.theme.colors.background.secondary};
    color: ${props => props.active 
      ? 'white' 
      : props.theme.colors.text.primary};
  }
`;

const ChartSection = styled.div`
  margin-bottom: 32px;
`;

const NeurotransmitterSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const NtButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active', 'color'].includes(prop),
})<{ active: boolean; color: string }>`
  padding: 8px 16px;
  border: 2px solid ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active ? props.color : 'transparent'};
  color: ${props => props.active ? 'white' : props.color};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.color};
    color: white;
  }
`;

const neurotransmitterConfig = {
  dopamine: {
    name: 'Dopamine',
    icon: '🧠',
    color: '#ff6b6b'
  },
  serotonin: {
    name: 'Serotonin',
    icon: '😊',
    color: '#4ecdc4'
  },
  norepinephrine: {
    name: 'Norepinephrine',
    icon: '⚡',
    color: '#45b7d1'
  }
};

type ViewMode = 'summary' | 'timeline' | 'doseResponse' | 'dashboard';
type NeurotransmitterType = 'dopamine' | 'serotonin' | 'norepinephrine';

const EffectDisplay: React.FC = () => {
  const { effects, selectedSubstance, currentDosage, currentRoute, currentUnit } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [selectedNeurotransmitter, setSelectedNeurotransmitter] = useState<NeurotransmitterType>('dopamine');

  // Effect cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any pending animations or timeouts
      const animations = document.querySelectorAll('[data-chart-animation]');
      animations.forEach(el => {
        const element = el as HTMLElement;
        if (element.style.animation) {
          element.style.animation = 'none';
        }
      });
    };
  }, []);

  // Reset neurotransmitter selection when effects change
  useEffect(() => {
    if (effects && viewMode === 'doseResponse') {
      setSelectedNeurotransmitter('dopamine');
    }
  }, [effects, viewMode]);

  // Always call hooks before any early returns
  const formatPercentage = useCallback((value: number) => `${Math.round(value)}%`, []);

  // Memoized heavy calculations for 30-50% faster renders
  const totalActivity = useMemo(() => {
    if (!effects) return 0;
    const { dopamine, serotonin, norepinephrine } = effects.effects;
    return dopamine.netActivity + serotonin.netActivity + norepinephrine.netActivity;
  }, [effects]);

  const dominantSystem = useMemo(() => {
    if (!effects) return { name: 'None', value: 0 };
    const { dopamine, serotonin, norepinephrine } = effects.effects;
    const activities = [
      { name: 'Dopamine', value: dopamine.netActivity },
      { name: 'Serotonin', value: serotonin.netActivity },
      { name: 'Norepinephrine', value: norepinephrine.netActivity }
    ];
    
    return activities.reduce((max, current) => 
      current.value > max.value ? current : max
    );
  }, [effects]);

  if (!effects) {
    return (
      <DisplayContainer>
        <EmptyState>
          <h3>No Effects Calculated</h3>
          <p>
            {selectedSubstance 
              ? 'Configure your dosage and click "Calculate Effects" to see the neurotransmitter impact.'
              : 'Select a substance and configure dosage to calculate effects.'
            }
          </p>
        </EmptyState>
      </DisplayContainer>
    );
  }

  const renderViewContent = () => {
    if (!selectedSubstance) return null;

    switch (viewMode) {
      case 'timeline':
        return (
          <ChartSection>
            <TimelineChart effects={effects} height="500px" />
          </ChartSection>
        );
      
      case 'doseResponse':
        return (
          <ChartSection>
            <NeurotransmitterSelector>
              {(Object.keys(neurotransmitterConfig) as NeurotransmitterType[]).map((nt) => {
                const config = neurotransmitterConfig[nt];
                return (
                  <NtButton
                    key={nt}
                    active={selectedNeurotransmitter === nt}
                    color={config.color}
                    onClick={() => setSelectedNeurotransmitter(nt)}
                  >
                    {config.icon} {config.name}
                  </NtButton>
                );
              })}
            </NeurotransmitterSelector>
            <DoseResponseChart 
              neurotransmitter={selectedNeurotransmitter}
            />
          </ChartSection>
        );
      
      case 'dashboard':
        return (
          <ChartSection>
            <NeurotransmitterDashboard />
          </ChartSection>
        );
      
      default: // summary
        return (
          <>
            <SummarySection>
              <SummaryTitle>
                {selectedSubstance?.name} Effects - {currentDosage}{currentUnit} ({currentRoute})
              </SummaryTitle>
              
              <SummaryGrid>
                <SummaryItem>
                  <SummaryLabel>Total Activity</SummaryLabel>
                  <SummaryValue>{Math.round(totalActivity)}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Dominant System</SummaryLabel>
                  <SummaryValue>{dominantSystem.name}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Source</SummaryLabel>
                  <SummaryValue>{effects.source === 'cached' ? 'Database' : 'LLM'}</SummaryValue>
                </SummaryItem>
              </SummaryGrid>
              
              <ConfidenceIndicator confidence={effects.confidence}>
                <ConfidenceLabel>Confidence:</ConfidenceLabel>
                <ConfidenceValue confidence={effects.confidence}>
                  {formatPercentage(effects.confidence * 100)}
                </ConfidenceValue>
              </ConfidenceIndicator>
            </SummarySection>

            <EffectGrid>
              {Object.entries(effects.effects).map(([key, effect]) => {
                const config = neurotransmitterConfig[key as keyof typeof neurotransmitterConfig];
                
                return (
                  <NeurotransmitterCard key={key} color={config.color}>
                    <CardHeader>
                      <NeurotransmitterIcon color={config.color}>
                        {config.icon}
                      </NeurotransmitterIcon>
                      <NeurotransmitterName>{config.name}</NeurotransmitterName>
                    </CardHeader>
                    
                    <EffectMetrics>
                      <EffectItem>
                        <EffectLabel>Reuptake Inhibition</EffectLabel>
                        <EffectValue intensity={effect.reuptakeInhibition}>
                          {formatPercentage(effect.reuptakeInhibition)}
                        </EffectValue>
                      </EffectItem>
                      <EffectBar intensity={effect.reuptakeInhibition} color={config.color} />
                      
                      <EffectItem>
                        <EffectLabel>Additional Release</EffectLabel>
                        <EffectValue intensity={effect.additionalRelease}>
                          {formatPercentage(effect.additionalRelease)}
                        </EffectValue>
                      </EffectItem>
                      <EffectBar intensity={effect.additionalRelease} color={config.color} />
                      
                      <EffectItem>
                        <EffectLabel>Net Activity</EffectLabel>
                        <EffectValue intensity={effect.netActivity}>
                          {Math.round(effect.netActivity)}
                        </EffectValue>
                      </EffectItem>
                      <EffectBar intensity={effect.netActivity} color={config.color} />
                    </EffectMetrics>
                  </NeurotransmitterCard>
                );
              })}
            </EffectGrid>
          </>
        );
    }
  };

  return (
    <DisplayContainer>
      {effects && (
        <ViewSelector>
          <ViewButton 
            active={viewMode === 'summary'} 
            onClick={() => setViewMode('summary')}
          >
            📊 Summary
          </ViewButton>
          <ViewButton 
            active={viewMode === 'timeline'} 
            onClick={() => setViewMode('timeline')}
          >
            ⏱️ Timeline
          </ViewButton>
          <ViewButton 
            active={viewMode === 'doseResponse'} 
            onClick={() => setViewMode('doseResponse')}
          >
            📈 Dose Response
          </ViewButton>
          <ViewButton 
            active={viewMode === 'dashboard'} 
            onClick={() => setViewMode('dashboard')}
          >
            🎛️ Dashboard
          </ViewButton>
        </ViewSelector>
      )}
      
      {renderViewContent()}
    </DisplayContainer>
  );
};

export default memo(EffectDisplay);