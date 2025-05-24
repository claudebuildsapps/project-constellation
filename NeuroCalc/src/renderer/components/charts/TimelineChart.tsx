import React from 'react';
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
import { NeurotransmitterEffect } from '../../types';

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

const ChartWrapper = styled.div<{ height?: string }>`
  position: relative;
  height: ${props => props.height || '400px'};
  width: 100%;
`;

const neurotransmitterColors = {
  dopamine: { primary: '#ff6b6b', background: '#ff6b6b20' },
  serotonin: { primary: '#4ecdc4', background: '#4ecdc420' },
  norepinephrine: { primary: '#45b7d1', background: '#45b7d120' },
  combined: { primary: '#8e44ad', background: '#8e44ad20' },
};

interface TimelineChartProps {
  effects: NeurotransmitterEffect;
  height?: string;
  showAllNeurotransmitters?: boolean;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ 
  effects, 
  height,
  showAllNeurotransmitters = true 
}) => {
  if (!effects?.effects) {
    return <div>No effect data available</div>;
  }

  const generateTimelineData = () => {
    const datasets = [];
    
    if (showAllNeurotransmitters) {
      // Show all three neurotransmitters
      Object.entries(effects.effects).forEach(([neurotransmitter, data]) => {
        if (data.timeProfile && data.timeProfile.length > 0) {
          const colors = neurotransmitterColors[neurotransmitter as keyof typeof neurotransmitterColors];
          
          datasets.push({
            label: `${neurotransmitter.charAt(0).toUpperCase() + neurotransmitter.slice(1)}`,
            data: data.timeProfile.map((point: { time: number; intensity: number }) => ({
              x: point.time,
              y: point.intensity * 100, // Convert to percentage
            })),
            borderColor: colors.primary,
            backgroundColor: colors.background,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.primary,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          });
        }
      });
    } else {
      // Show combined effect
      const combinedData = calculateCombinedEffect();
      const colors = neurotransmitterColors.combined;
      
      datasets.push({
        label: 'Combined Effect',
        data: combinedData,
        borderColor: colors.primary,
        backgroundColor: colors.background,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors.primary,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      });
    }
    
    return datasets;
  };

  const calculateCombinedEffect = () => {
    const timePoints = new Map<number, number>();
    
    // Combine all neurotransmitter effects
    Object.values(effects.effects).forEach(data => {
      if (data.timeProfile) {
        data.timeProfile.forEach((point: { time: number; intensity: number }) => {
          const currentValue = timePoints.get(point.time) || 0;
          timePoints.set(point.time, currentValue + point.intensity * 100);
        });
      }
    });
    
    return Array.from(timePoints.entries())
      .map(([time, intensity]) => ({ x: time, y: intensity / 3 })) // Average across neurotransmitters
      .sort((a, b) => a.x - b.x);
  };

  const getMaxTime = () => {
    let maxTime = 0;
    Object.values(effects.effects).forEach(data => {
      if (data.timeProfile && data.timeProfile.length > 0) {
        const lastPoint = data.timeProfile[data.timeProfile.length - 1];
        maxTime = Math.max(maxTime, lastPoint.time);
      }
    });
    return maxTime || 480; // Default 8 hours if no data
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const datasets = generateTimelineData();
  const maxTime = getMaxTime();

  const chartData = {
    datasets,
  };

  const options: ChartOptions<'line'> = {
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
            return `Time: ${formatTime(context[0].parsed.x)}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        min: 0,
        max: maxTime,
        ticks: {
          callback: function(value) {
            return formatTime(value as number);
          },
          stepSize: 60, // 1 hour intervals
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Effect Intensity (%)',
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

  const title = `${effects.substance} Timeline - ${effects.dosage} (${effects.route})`;

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartWrapper height={height}>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default TimelineChart;