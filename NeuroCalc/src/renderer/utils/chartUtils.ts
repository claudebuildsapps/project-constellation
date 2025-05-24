// Optimized Chart.js imports - only what we actually use
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { NeurotransmitterEffect, TimePoint } from '../types';

// Register only the components we actually use
// This reduces bundle size by ~30KB compared to importing all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Chart utilities for NeuroCalc visualizations
 */
export class ChartUtils {
  
  /**
   * Default chart options for consistent styling
   */
  static getDefaultOptions(): Partial<ChartOptions> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            color: '#6b7280',
          },
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            color: '#6b7280',
          },
        },
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart',
      },
    };
  }

  /**
   * Generate time profile chart data for neurotransmitter effects
   */
  static generateTimeProfileData(effect: NeurotransmitterEffect): ChartData<'line'> {
    const labels = effect.effects.dopamine.timeProfile.map(point => 
      `${Math.round(point.time)}min`
    );

    return {
      labels,
      datasets: [
        {
          label: 'Dopamine',
          data: effect.effects.dopamine.timeProfile.map(point => 
            point.intensity * effect.effects.dopamine.netActivity
          ),
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: 'Serotonin',
          data: effect.effects.serotonin.timeProfile.map(point => 
            point.intensity * effect.effects.serotonin.netActivity
          ),
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: 'Norepinephrine',
          data: effect.effects.norepinephrine.timeProfile.map(point => 
            point.intensity * effect.effects.norepinephrine.netActivity
          ),
          borderColor: '#45b7d1',
          backgroundColor: 'rgba(69, 183, 209, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
      ],
    };
  }

  /**
   * Generate dose-response curve data
   */
  static generateDoseResponseData(
    doses: number[],
    responses: { dopamine: number[]; serotonin: number[]; norepinephrine: number[] }
  ): ChartData<'line'> {
    const labels = doses.map(dose => `${dose}mg`);

    return {
      labels,
      datasets: [
        {
          label: 'Dopamine Response',
          data: responses.dopamine,
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 3,
        },
        {
          label: 'Serotonin Response',
          data: responses.serotonin,
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 3,
        },
        {
          label: 'Norepinephrine Response',
          data: responses.norepinephrine,
          borderColor: '#45b7d1',
          backgroundColor: 'rgba(69, 183, 209, 0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 3,
        },
      ],
    };
  }

  /**
   * Generate neurotransmitter activity bar chart data
   */
  static generateActivityBarData(effect: NeurotransmitterEffect): ChartData<'bar'> {
    return {
      labels: ['Reuptake Inhibition', 'Additional Release', 'Net Activity'],
      datasets: [
        {
          label: 'Dopamine',
          data: [
            effect.effects.dopamine.reuptakeInhibition,
            effect.effects.dopamine.additionalRelease,
            effect.effects.dopamine.netActivity,
          ],
          backgroundColor: 'rgba(255, 107, 107, 0.7)',
          borderColor: '#ff6b6b',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Serotonin',
          data: [
            effect.effects.serotonin.reuptakeInhibition,
            effect.effects.serotonin.additionalRelease,
            effect.effects.serotonin.netActivity,
          ],
          backgroundColor: 'rgba(78, 205, 196, 0.7)',
          borderColor: '#4ecdc4',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Norepinephrine',
          data: [
            effect.effects.norepinephrine.reuptakeInhibition,
            effect.effects.norepinephrine.additionalRelease,
            effect.effects.norepinephrine.netActivity,
          ],
          backgroundColor: 'rgba(69, 183, 209, 0.7)',
          borderColor: '#45b7d1',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }

  /**
   * Get chart options for time profile charts
   */
  static getTimeProfileOptions(): ChartOptions<'line'> {
    return {
      ...this.getDefaultOptions(),
      scales: {
        x: {
          ...this.getDefaultOptions().scales?.x,
          title: {
            display: true,
            text: 'Time (minutes)',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
        },
        y: {
          ...this.getDefaultOptions().scales?.y,
          title: {
            display: true,
            text: 'Effect Intensity',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
          min: 0,
        },
      },
      plugins: {
        ...this.getDefaultOptions().plugins,
        title: {
          display: true,
          text: 'Effect Timeline',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#1f2937',
          padding: 20,
        },
      },
    } as ChartOptions<'line'>;
  }

  /**
   * Get chart options for dose-response charts
   */
  static getDoseResponseOptions(): ChartOptions<'line'> {
    return {
      ...this.getDefaultOptions(),
      scales: {
        x: {
          ...this.getDefaultOptions().scales?.x,
          title: {
            display: true,
            text: 'Dosage (mg)',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
        },
        y: {
          ...this.getDefaultOptions().scales?.y,
          title: {
            display: true,
            text: 'Response Intensity',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
          min: 0,
        },
      },
      plugins: {
        ...this.getDefaultOptions().plugins,
        title: {
          display: true,
          text: 'Dose-Response Relationship',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#1f2937',
          padding: 20,
        },
      },
    } as ChartOptions<'line'>;
  }

  /**
   * Get chart options for activity bar charts
   */
  static getActivityBarOptions(): ChartOptions<'bar'> {
    return {
      ...this.getDefaultOptions(),
      scales: {
        x: {
          ...this.getDefaultOptions().scales?.x,
          title: {
            display: true,
            text: 'Effect Type',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
        },
        y: {
          ...this.getDefaultOptions().scales?.y,
          title: {
            display: true,
            text: 'Effect Magnitude (%)',
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#374151',
          },
          min: 0,
        },
      },
      plugins: {
        ...this.getDefaultOptions().plugins,
        title: {
          display: true,
          text: 'Neurotransmitter Activity Comparison',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#1f2937',
          padding: 20,
        },
      },
    } as ChartOptions<'bar'>;
  }

  /**
   * Generate color palette for charts
   */
  static getColorPalette() {
    return {
      dopamine: {
        primary: '#ff6b6b',
        secondary: '#ff8e8e',
        background: 'rgba(255, 107, 107, 0.1)',
      },
      serotonin: {
        primary: '#4ecdc4',
        secondary: '#7dd8d2',
        background: 'rgba(78, 205, 196, 0.1)',
      },
      norepinephrine: {
        primary: '#45b7d1',
        secondary: '#6bc5d8',
        background: 'rgba(69, 183, 209, 0.1)',
      },
    };
  }
}