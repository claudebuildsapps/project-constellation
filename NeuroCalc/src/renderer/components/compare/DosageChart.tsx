import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Substance } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartLegend);

interface DosageChartProps {
  substances: (Substance | null)[];
  route: string;
  className?: string;
}

const ChartContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 400px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const RouteTag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const DosageChart: React.FC<DosageChartProps> = ({
  substances,
  route,
  className
}) => {
  const chartRef = useRef(null);
  const validSubstances = substances.filter((s): s is Substance => s !== null);

  const getDosageData = (substance: Substance, route: string) => {
    const routeData = substance.dosageRanges.find(r => r.route.toLowerCase() === route.toLowerCase());
    if (!routeData) return null;

    return {
      threshold: routeData.threshold || 0,
      light: routeData.light || 0,
      common: routeData.common || 0,
      strong: routeData.strong || 0,
      heavy: routeData.heavy || 0
    };
  };

  const getSubstanceColor = (index: number): string => {
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];
    return colors[index % colors.length];
  };

  const chartData = React.useMemo(() => {
    if (validSubstances.length === 0) return null;

    const dosageCategories = ['Threshold', 'Light', 'Common', 'Strong', 'Heavy'];
    const datasets = validSubstances.map((substance, index) => {
      const dosageData = getDosageData(substance, route);
      if (!dosageData) return null;

      const color = getSubstanceColor(index);
      
      return {
        label: substance.name,
        data: [
          dosageData.threshold,
          dosageData.light,
          dosageData.common,
          dosageData.strong,
          dosageData.heavy
        ],
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      };
    }).filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== null);

    return {
      labels: dosageCategories,
      datasets
    };
  }, [validSubstances, route]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const substanceName = context.dataset.label;
            const dosage = context.parsed.y;
            const unit = validSubstances.find(s => s.name === substanceName)?.dosageRanges
              .find(r => r.route.toLowerCase() === route.toLowerCase())?.unit || 'mg';
            
            return `${substanceName}: ${dosage}${unit}`;
          },
          afterLabel: (context) => {
            const substance = validSubstances.find(s => s.name === context.dataset.label);
            if (substance?.warnings?.length) {
              return `⚠️ ${substance.warnings[0]}`;
            }
            return '';
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#333333',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666666',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666666',
          font: {
            size: 11
          },
          callback: function(value) {
            // Find the most common unit among substances
            const units = validSubstances.map(s => 
              s.dosageRanges.find(r => r.route.toLowerCase() === route.toLowerCase())?.unit
            ).filter(Boolean);
            const commonUnit = units[0] || 'mg';
            
            return `${value}${commonUnit}`;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (validSubstances.length === 0) {
    return (
      <ChartContainer className={className}>
        <ChartHeader>
          <ChartTitle>Dosage Comparison</ChartTitle>
          <RouteTag>{route}</RouteTag>
        </ChartHeader>
        <EmptyState>
          <div>📊</div>
          <div>Select substances to compare dosage ranges</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const hasValidData = validSubstances.some(s => getDosageData(s, route) !== null);

  if (!hasValidData) {
    return (
      <ChartContainer className={className}>
        <ChartHeader>
          <ChartTitle>Dosage Comparison</ChartTitle>
          <RouteTag>{route}</RouteTag>
        </ChartHeader>
        <EmptyState>
          <div>❌</div>
          <div>No dosage data available for {route} route</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Try selecting a different administration route
          </div>
        </EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader>
        <ChartTitle>Dosage Comparison</ChartTitle>
        <RouteTag>{route}</RouteTag>
      </ChartHeader>
      
      <div style={{ height: '280px' }}>
        {chartData && <Bar ref={chartRef} data={chartData} options={options} />}
      </div>

      <Legend>
        {validSubstances.map((substance, index) => {
          const dosageData = getDosageData(substance, route);
          if (!dosageData) return null;
          
          return (
            <LegendItem key={substance.id}>
              <LegendColor color={getSubstanceColor(index)} />
              <span>{substance.name}</span>
            </LegendItem>
          );
        })}
      </Legend>
    </ChartContainer>
  );
};

export default DosageChart;