import React, { useRef, useEffect } from 'react';
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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Substance } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TimelineChartProps {
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
  height: 450px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h3`
  color: ${props => props.theme.colors.textPrimary};
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

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ControlButton = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#ddd'};
  background: ${props => props.active ? props.theme.colors.primary + '20' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-radius: 16px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px;
  background: ${props => props.theme.colors.background};
  border-radius: 6px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const PhaseIndicator = styled.span<{ phase: string }>`
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 500;
  background: ${props => {
    switch (props.phase) {
      case 'onset': return '#4caf5020';
      case 'comeup': return '#ff980020';
      case 'peak': return '#f4433620';
      case 'offset': return '#2196f320';
      case 'after': return '#75757520';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.phase) {
      case 'onset': return '#4caf50';
      case 'comeup': return '#ff9800';
      case 'peak': return '#f44336';
      case 'offset': return '#2196f3';
      case 'after': return '#757575';
      default: return 'inherit';
    }
  }};
`;

const TimelineChart: React.FC<TimelineChartProps> = ({
  substances,
  route,
  className
}) => {
  const chartRef = useRef(null);
  const [viewMode, setViewMode] = React.useState<'duration' | 'intensity' | 'both'>('both');
  const [timeScale, setTimeScale] = React.useState<'hours' | 'minutes'>('hours');
  
  const validSubstances = substances.filter((s): s is Substance => s !== null);

  const getTimingData = (substance: Substance, route: string) => {
    const routeData = substance.dosageRanges.find(r => r.route.toLowerCase() === route.toLowerCase());
    if (!substance.pharmacokinetics) return null;

    const pk = substance.pharmacokinetics;
    return {
      onset: pk.onset.min || 0,
      comeup: (pk.peak.min - pk.onset.min) || 0,
      peak: pk.peak.min || 0,
      offset: pk.duration.min || 0,
      total: pk.duration.max || 0,
      afterEffects: 0
    };
  };

  const getSubstanceColor = (index: number): string => {
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];
    return colors[index % colors.length];
  };

  const convertTime = (minutes: number): number => {
    return timeScale === 'hours' ? minutes / 60 : minutes;
  };

  const generateTimelineData = (substance: Substance, color: string) => {
    const timingData = getTimingData(substance, route);
    if (!timingData) return null;

    const points = [];
    let currentTime = 0;

    // Onset phase (0% intensity)
    points.push({ x: convertTime(currentTime), y: 0, phase: 'onset' });
    currentTime += timingData.onset;
    
    // Start of comeup (10% intensity)
    points.push({ x: convertTime(currentTime), y: 10, phase: 'comeup' });
    currentTime += timingData.comeup;
    
    // Peak start (100% intensity)
    points.push({ x: convertTime(currentTime), y: 100, phase: 'peak' });
    currentTime += timingData.peak;
    
    // Peak end (100% intensity)
    points.push({ x: convertTime(currentTime), y: 100, phase: 'peak' });
    currentTime += timingData.offset;
    
    // End of offset (5% intensity)
    points.push({ x: convertTime(currentTime), y: 5, phase: 'offset' });
    
    // After effects (if any)
    if (timingData.afterEffects > 0) {
      currentTime += timingData.afterEffects;
      points.push({ x: convertTime(currentTime), y: 2, phase: 'after' });
      points.push({ x: convertTime(currentTime + 30), y: 0, phase: 'after' });
    } else {
      points.push({ x: convertTime(currentTime + 30), y: 0, phase: 'offset' });
    }

    return {
      label: substance.name,
      data: points,
      borderColor: color,
      backgroundColor: color + '20',
      fill: viewMode === 'duration' ? false : true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    };
  };

  const chartData = React.useMemo(() => {
    if (validSubstances.length === 0) return null;

    const datasets = validSubstances.map((substance, index) => {
      const color = getSubstanceColor(index);
      return generateTimelineData(substance, color);
    }).filter(Boolean);

    return { datasets };
  }, [validSubstances, route, viewMode, timeScale]);

  const options: ChartOptions<'line'> = {
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
          title: (context) => {
            const time = context[0].parsed.x;
            const unit = timeScale === 'hours' ? 'h' : 'min';
            return `Time: ${time.toFixed(1)}${unit}`;
          },
          label: (context) => {
            const intensity = context.parsed.y;
            const substanceName = context.dataset.label;
            const point = context.raw as any;
            
            return [
              `${substanceName}: ${intensity}% intensity`,
              `Phase: ${point.phase}`
            ];
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
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: `Time (${timeScale})`,
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666666',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: viewMode === 'duration' ? undefined : 110,
        title: {
          display: viewMode !== 'duration',
          text: 'Effect Intensity (%)',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666666',
          font: {
            size: 11
          },
          callback: function(value) {
            return viewMode === 'duration' ? '' : `${value}%`;
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
          <ChartTitle>Duration Timeline</ChartTitle>
          <RouteTag>{route}</RouteTag>
        </ChartHeader>
        <EmptyState>
          <div>⏱️</div>
          <div>Select substances to compare duration timelines</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const hasValidData = validSubstances.some(s => getTimingData(s, route) !== null);

  if (!hasValidData) {
    return (
      <ChartContainer className={className}>
        <ChartHeader>
          <ChartTitle>Duration Timeline</ChartTitle>
          <RouteTag>{route}</RouteTag>
        </ChartHeader>
        <EmptyState>
          <div>❌</div>
          <div>No duration data available for {route} route</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader>
        <ChartTitle>Duration Timeline</ChartTitle>
        <RouteTag>{route}</RouteTag>
      </ChartHeader>

      <Controls>
        <ControlButton
          active={viewMode === 'both'}
          onClick={() => setViewMode('both')}
        >
          📊 Intensity Curve
        </ControlButton>
        <ControlButton
          active={viewMode === 'duration'}
          onClick={() => setViewMode('duration')}
        >
          ⏱️ Duration Only
        </ControlButton>
        <ControlButton
          active={timeScale === 'hours'}
          onClick={() => setTimeScale('hours')}
        >
          Hours
        </ControlButton>
        <ControlButton
          active={timeScale === 'minutes'}
          onClick={() => setTimeScale('minutes')}
        >
          Minutes
        </ControlButton>
      </Controls>
      
      <div style={{ height: '300px' }}>
        {chartData && <Line ref={chartRef} data={chartData} options={options} />}
      </div>

      <Legend>
        {validSubstances.map((substance, index) => {
          const timingData = getTimingData(substance, route);
          if (!timingData) return null;
          
          const totalDuration = timingData.total + (timingData.afterEffects || 0);
          const unit = timeScale === 'hours' ? 'h' : 'min';
          const displayDuration = timeScale === 'hours' ? totalDuration / 60 : totalDuration;
          
          return (
            <LegendItem key={substance.id}>
              <LegendColor color={getSubstanceColor(index)} />
              <div>
                <strong>{substance.name}</strong>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  Duration: {displayDuration.toFixed(1)}{unit}
                  {' • '}
                  <PhaseIndicator phase="onset">Onset</PhaseIndicator>
                  {' '}
                  <PhaseIndicator phase="comeup">Comeup</PhaseIndicator>
                  {' '}
                  <PhaseIndicator phase="peak">Peak</PhaseIndicator>
                  {' '}
                  <PhaseIndicator phase="offset">Offset</PhaseIndicator>
                  {timingData.afterEffects > 0 && (
                    <>
                      {' '}
                      <PhaseIndicator phase="after">After</PhaseIndicator>
                    </>
                  )}
                </div>
              </div>
            </LegendItem>
          );
        })}
      </Legend>
    </ChartContainer>
  );
};

export default TimelineChart;