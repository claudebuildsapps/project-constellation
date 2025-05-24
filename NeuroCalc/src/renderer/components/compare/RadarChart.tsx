import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Substance, NeurotransmitterEffect } from '../../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  margin: 20px 0;
`;

const ChartHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const ChartSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: ${props => props.color};
  border: 2px solid ${props => props.color};
`;

const LegendLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const EmptyState = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  margin-bottom: 8px;
`;

const EmptyHint = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-style: italic;
  opacity: 0.7;
`;

interface RadarChartProps {
  substances: (Substance | null)[];
  effects?: (NeurotransmitterEffect | null)[];
  title?: string;
  subtitle?: string;
  showReuptakeInhibition?: boolean;
  showAdditionalRelease?: boolean;
  showNetActivity?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
  substances,
  effects = [],
  title = "Neurotransmitter Activity Comparison",
  subtitle = "Comparative analysis of substance effects on neurotransmitter systems",
  showReuptakeInhibition = true,
  showAdditionalRelease = true,
  showNetActivity = false
}) => {
  const validSubstances = substances.filter((s): s is Substance => s !== null);
  const validEffects = effects.filter((e): e is NeurotransmitterEffect => e !== null);

  // Generate mock effects if none provided (for visualization purposes)
  const getEffectsForSubstance = (substance: Substance): NeurotransmitterEffect => {
    const existingEffect = validEffects.find(e => e.substance === substance.id);
    if (existingEffect) return existingEffect;

    // Generate mock data based on substance mechanisms
    const mockEffect: NeurotransmitterEffect = {
      substance: substance.id,
      dosage: 100,
      route: 'oral',
      timestamp: Date.now(),
      effects: {
        norepinephrine: { reuptakeInhibition: 0, additionalRelease: 0, netActivity: 0, timeProfile: [] },
        dopamine: { reuptakeInhibition: 0, additionalRelease: 0, netActivity: 0, timeProfile: [] },
        serotonin: { reuptakeInhibition: 0, additionalRelease: 0, netActivity: 0, timeProfile: [] },
      },
      confidence: 0.7,
      source: 'calculated'
    };

    // Apply substance-specific mock calculations
    substance.mechanisms.forEach(mechanism => {
      const baseEffect = Math.random() * 60 + 20; // 20-80 range
      
      switch (mechanism.target) {
        case 'DAT':
          if (mechanism.type === 'inhibition') {
            mockEffect.effects.dopamine.reuptakeInhibition = baseEffect;
          } else if (mechanism.type === 'release') {
            mockEffect.effects.dopamine.additionalRelease = baseEffect;
          }
          break;
        case 'SERT':
          if (mechanism.type === 'inhibition') {
            mockEffect.effects.serotonin.reuptakeInhibition = baseEffect;
          } else if (mechanism.type === 'release') {
            mockEffect.effects.serotonin.additionalRelease = baseEffect;
          }
          break;
        case 'NET':
          if (mechanism.type === 'inhibition') {
            mockEffect.effects.norepinephrine.reuptakeInhibition = baseEffect;
          } else if (mechanism.type === 'release') {
            mockEffect.effects.norepinephrine.additionalRelease = baseEffect;
          }
          break;
      }
    });

    // Calculate net activity
    Object.values(mockEffect.effects).forEach(effect => {
      effect.netActivity = effect.reuptakeInhibition + (effect.additionalRelease * 0.5);
    });

    return mockEffect;
  };

  if (validSubstances.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
          <ChartSubtitle>{subtitle}</ChartSubtitle>
        </ChartHeader>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <EmptyText>No Substances Selected</EmptyText>
          <EmptyHint>Select substances to view neurotransmitter activity comparison</EmptyHint>
        </EmptyState>
      </ChartContainer>
    );
  }

  // Build chart data
  const labels: string[] = [];
  const datasets: any[] = [];

  if (showReuptakeInhibition) {
    labels.push('NE Reuptake Inhibition', 'DA Reuptake Inhibition', 'SER Reuptake Inhibition');
  }
  if (showAdditionalRelease) {
    labels.push('NE Additional Release', 'DA Additional Release', 'SER Additional Release');
  }
  if (showNetActivity) {
    labels.push('NE Net Activity', 'DA Net Activity', 'SER Net Activity');
  }

  // Default to reuptake inhibition if nothing selected
  if (labels.length === 0) {
    labels.push('NE Reuptake Inhibition', 'DA Reuptake Inhibition', 'SER Reuptake Inhibition');
  }

  validSubstances.forEach((substance, index) => {
    const effect = getEffectsForSubstance(substance);
    const data: number[] = [];

    if (showReuptakeInhibition || labels.length === 3) {
      data.push(
        effect.effects.norepinephrine.reuptakeInhibition,
        effect.effects.dopamine.reuptakeInhibition,
        effect.effects.serotonin.reuptakeInhibition
      );
    }
    if (showAdditionalRelease) {
      data.push(
        effect.effects.norepinephrine.additionalRelease,
        effect.effects.dopamine.additionalRelease,
        effect.effects.serotonin.additionalRelease
      );
    }
    if (showNetActivity) {
      data.push(
        effect.effects.norepinephrine.netActivity,
        effect.effects.dopamine.netActivity,
        effect.effects.serotonin.netActivity
      );
    }

    const color = substance.color || `hsl(${index * 137.5 % 360}, 70%, 50%)`;
    
    datasets.push({
      label: substance.name,
      data,
      borderColor: color,
      backgroundColor: `${color}20`,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color,
      pointRadius: 4,
      pointHoverRadius: 6,
    });
  });

  const chartData = {
    labels,
    datasets,
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll use custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: '#999',
          backdropColor: 'transparent',
        }
      }
    },
    interaction: {
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.1,
      }
    }
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        <ChartSubtitle>{subtitle}</ChartSubtitle>
      </ChartHeader>
      
      <ChartWrapper>
        <Radar data={chartData} options={options} />
      </ChartWrapper>

      <LegendContainer>
        {validSubstances.map((substance, index) => (
          <LegendItem key={substance.id}>
            <LegendColor color={substance.color || `hsl(${index * 137.5 % 360}, 70%, 50%)`} />
            <LegendLabel>{substance.name}</LegendLabel>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartContainer>
  );
};

export default RadarChart;