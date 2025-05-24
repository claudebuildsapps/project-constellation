import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppStore } from '../../store/useAppStore';
import { Substance } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: ${props => props.theme.shadows.md};
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

interface DoseResponseChartProps {
  neurotransmitter: 'dopamine' | 'serotonin' | 'norepinephrine';
}

const DoseResponseChart: React.FC<DoseResponseChartProps> = ({ neurotransmitter }) => {
  const { selectedSubstance, currentRoute } = useAppStore();

  const chartData = useMemo(() => {
    if (!selectedSubstance) return null;

    const range = selectedSubstance.dosageRanges.find(r => r.route === currentRoute);
    if (!range) return null;

    // Generate dose points from threshold to heavy dose
    const doses = [];
    const step = (range.heavy - range.threshold) / 20;
    for (let dose = range.threshold; dose <= range.heavy * 1.5; dose += step) {
      doses.push(dose);
    }

    // Calculate effects for each dose
    const effectData = doses.map(dose => {
      const doseRatio = calculateDoseRatio(selectedSubstance, dose, currentRoute);
      return calculateNeurotransmitterEffect(selectedSubstance, doseRatio, neurotransmitter);
    });

    // Chart.js configuration
    const labels = doses.map(dose => `${dose.toFixed(1)}${range.unit}`);
    
    const neurotransmitterConfig = {
      dopamine: { color: '#ff6b6b', name: 'Dopamine' },
      serotonin: { color: '#4ecdc4', name: 'Serotonin' },
      norepinephrine: { color: '#45b7d1', name: 'Norepinephrine' },
    };

    const config = neurotransmitterConfig[neurotransmitter];

    return {
      labels,
      datasets: [
        {
          label: 'Reuptake Inhibition (%)',
          data: effectData.map(effect => effect.reuptakeInhibition),
          borderColor: config.color,
          backgroundColor: `${config.color}20`,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
        },
        {
          label: 'Additional Release (%)',
          data: effectData.map(effect => effect.additionalRelease),
          borderColor: config.color,
          backgroundColor: `${config.color}10`,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
        }
      ]
    };
  }, [selectedSubstance, currentRoute, neurotransmitter]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            return `Dosage: ${context[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: `Dosage (${selectedSubstance?.dosageRanges.find(r => r.route === currentRoute)?.unit || 'mg'})`,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Effect Percentage (%)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (!selectedSubstance) {
    return (
      <ChartContainer>
        <ChartTitle>Dose-Response Curve</ChartTitle>
        <NoDataMessage>
          Select a substance to view dose-response curves
        </NoDataMessage>
      </ChartContainer>
    );
  }

  if (!chartData) {
    return (
      <ChartContainer>
        <ChartTitle>Dose-Response Curve</ChartTitle>
        <NoDataMessage>
          No data available for the selected route
        </NoDataMessage>
      </ChartContainer>
    );
  }

  const neurotransmitterNames = {
    dopamine: 'Dopamine',
    serotonin: 'Serotonin', 
    norepinephrine: 'Norepinephrine'
  };

  return (
    <ChartContainer>
      <ChartTitle>
        {neurotransmitterNames[neurotransmitter]} Dose-Response Curve - {selectedSubstance.name}
      </ChartTitle>
      <ChartWrapper>
        <Line data={chartData} options={chartOptions} />
      </ChartWrapper>
    </ChartContainer>
  );
};

// Helper functions
function calculateDoseRatio(substance: Substance, dosage: number, route: string): number {
  const range = substance.dosageRanges.find(r => r.route === route);
  if (!range) return 0;
  
  if (dosage <= range.threshold) return 0;
  if (dosage <= range.light) return 0.25;
  if (dosage <= range.common) return 0.5;
  if (dosage <= range.strong) return 0.75;
  return Math.min(1.5, 1 + (dosage - range.strong) / range.strong);
}

function calculateNeurotransmitterEffect(
  substance: Substance, 
  doseRatio: number, 
  neurotransmitter: 'dopamine' | 'serotonin' | 'norepinephrine'
) {
  let reuptakeInhibition = 0;
  let additionalRelease = 0;

  const targetMap = {
    dopamine: 'DAT',
    serotonin: 'SERT', 
    norepinephrine: 'NET'
  } as const;

  const target = targetMap[neurotransmitter];
  
  substance.mechanisms.forEach(mechanism => {
    if (mechanism.target === target) {
      if (mechanism.type === 'inhibition') {
        const baseInhibition = neurotransmitter === 'dopamine' ? 50 : 
                             neurotransmitter === 'serotonin' ? 40 : 60;
        reuptakeInhibition = Math.min(100, doseRatio * baseInhibition);
      } else if (mechanism.type === 'release') {
        const baseRelease = neurotransmitter === 'dopamine' ? 100 : 
                           neurotransmitter === 'serotonin' ? 80 : 120;
        additionalRelease = doseRatio * baseRelease;
      }
    }
  });

  return { reuptakeInhibition, additionalRelease };
}

export default DoseResponseChart;