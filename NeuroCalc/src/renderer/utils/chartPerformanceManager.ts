/**
 * Chart Performance Manager
 * Optimizes chart rendering with instance pooling, data memoization, and cleanup
 */

import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';

interface ChartInstance {
  chart: Chart;
  lastUsed: number;
  inUse: boolean;
  elementId: string;
}

interface ChartDataCache {
  data: any;
  options: ChartOptions;
  timestamp: number;
  hash: string;
}

export class ChartPerformanceManager {
  private static instance: ChartPerformanceManager;
  private chartPool = new Map<string, ChartInstance>();
  private dataCache = new Map<string, ChartDataCache>();
  private readonly POOL_SIZE_LIMIT = 10;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly CLEANUP_INTERVAL = 60000; // 1 minute
  
  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
    
    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.destroyAll());
    }
  }
  
  public static getInstance(): ChartPerformanceManager {
    if (!ChartPerformanceManager.instance) {
      ChartPerformanceManager.instance = new ChartPerformanceManager();
    }
    return ChartPerformanceManager.instance;
  }
  
  /**
   * Get or create optimized chart instance with pooling
   */
  public getOptimizedChart(
    elementId: string,
    config: ChartConfiguration,
    forceRecreate: boolean = false
  ): Chart {
    
    // Check if we can reuse existing chart
    const existing = this.chartPool.get(elementId);
    if (existing && !forceRecreate && !existing.inUse) {
      existing.inUse = true;
      existing.lastUsed = Date.now();
      
      // Update chart data efficiently
      this.updateChartData(existing.chart, config);
      return existing.chart;
    }
    
    // Create new chart with optimized configuration
    const optimizedConfig = this.optimizeChartConfig(config);
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    
    if (!canvas) {
      throw new Error(`Canvas element with id '${elementId}' not found`);
    }
    
    // Destroy existing chart if present
    if (existing) {
      existing.chart.destroy();
    }
    
    // Create new chart with performance optimizations
    const chart = new Chart(canvas, optimizedConfig);
    
    // Add to pool
    this.chartPool.set(elementId, {
      chart,
      lastUsed: Date.now(),
      inUse: true,
      elementId
    });
    
    return chart;
  }
  
  /**
   * Optimize chart configuration for performance
   */
  private optimizeChartConfig(config: ChartConfiguration): ChartConfiguration {
    const optimized = { ...config };
    
    // Optimize options for performance
    if (!optimized.options) {
      optimized.options = {};
    }
    
    // Disable animations for better performance during interactions
    optimized.options.animation = {
      duration: 300, // Reduced from default 1000ms
      easing: 'easeOutQuad'
    };
    
    // Optimize responsive settings
    optimized.options.responsive = true;
    optimized.options.maintainAspectRatio = false;
    
    // Optimize interaction settings
    optimized.options.interaction = {
      intersect: false,
      mode: 'index'
    };
    
    // Optimize scales for performance
    if (optimized.options.scales) {
      Object.values(optimized.options.scales).forEach(scale => {
        if (scale && typeof scale === 'object') {
          // Reduce tick calculations
          scale.ticks = {
            ...scale.ticks,
            maxTicksLimit: 10,
            sampleSize: 100
          };
        }
      });
    }
    
    // Optimize plugins
    optimized.options.plugins = {
      ...optimized.options.plugins,
      legend: {
        ...optimized.options.plugins?.legend,
        labels: {
          ...optimized.options.plugins?.legend?.labels,
          usePointStyle: true,
          boxWidth: 12
        }
      }
    };
    
    return optimized;
  }
  
  /**
   * Efficiently update chart data without full recreation
   */
  private updateChartData(chart: Chart, config: ChartConfiguration): void {
    if (config.data) {
      // Update datasets efficiently
      chart.data.labels = config.data.labels;
      chart.data.datasets = config.data.datasets;
      
      // Update with animation
      chart.update('none'); // No animation for performance
    }
  }
  
  /**
   * Memoized chart data with hashing
   */
  public getMemoizedChartData(
    dataKey: string,
    dataGenerator: () => any,
    optionsGenerator: () => ChartOptions
  ): { data: any; options: ChartOptions } {
    
    // Generate hash for cache key
    const hash = this.generateDataHash(dataKey);
    const cached = this.dataCache.get(hash);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { data: cached.data, options: cached.options };
    }
    
    // Generate new data
    const data = dataGenerator();
    const options = optionsGenerator();
    
    // Cache the result
    this.dataCache.set(hash, {
      data,
      options,
      timestamp: Date.now(),
      hash
    });
    
    return { data, options };
  }
  
  /**
   * Generate hash for data caching
   */
  private generateDataHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
  
  /**
   * Release chart back to pool
   */
  public releaseChart(elementId: string): void {
    const chartInstance = this.chartPool.get(elementId);
    if (chartInstance) {
      chartInstance.inUse = false;
      chartInstance.lastUsed = Date.now();
    }
  }
  
  /**
   * Progressive chart loading for multiple charts
   */
  public async loadChartsProgressively(
    chartConfigs: Array<{ elementId: string; config: ChartConfiguration; priority: number }>
  ): Promise<Chart[]> {
    
    // Sort by priority
    const sortedConfigs = chartConfigs.sort((a, b) => b.priority - a.priority);
    const charts: Chart[] = [];
    
    // Load high-priority charts first
    for (const { elementId, config } of sortedConfigs) {
      const chart = this.getOptimizedChart(elementId, config);
      charts.push(chart);
      
      // Small delay to prevent UI blocking
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return charts;
  }
  
  /**
   * Coordinate animations across multiple charts
   */
  public coordinateAnimations(chartIds: string[], delay: number = 100): void {
    chartIds.forEach((id, index) => {
      const chartInstance = this.chartPool.get(id);
      if (chartInstance) {
        setTimeout(() => {
          chartInstance.chart.update('active');
        }, index * delay);
      }
    });
  }
  
  /**
   * Cleanup unused charts and expired cache
   */
  private cleanup(): void {
    const now = Date.now();
    
    // Cleanup unused charts
    for (const [elementId, instance] of this.chartPool.entries()) {
      if (!instance.inUse && now - instance.lastUsed > this.CACHE_TTL) {
        instance.chart.destroy();
        this.chartPool.delete(elementId);
      }
    }
    
    // Cleanup expired cache
    for (const [hash, cached] of this.dataCache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL) {
        this.dataCache.delete(hash);
      }
    }
    
    // Limit pool size
    if (this.chartPool.size > this.POOL_SIZE_LIMIT) {
      const entries = Array.from(this.chartPool.entries())
        .filter(([, instance]) => !instance.inUse)
        .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
      
      const toRemove = entries.slice(0, entries.length - this.POOL_SIZE_LIMIT);
      toRemove.forEach(([elementId, instance]) => {
        instance.chart.destroy();
        this.chartPool.delete(elementId);
      });
    }
  }
  
  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): {
    activeCharts: number;
    poolSize: number;
    cacheSize: number;
    memoryUsage: string;
  } {
    const activeCharts = Array.from(this.chartPool.values()).filter(i => i.inUse).length;
    
    return {
      activeCharts,
      poolSize: this.chartPool.size,
      cacheSize: this.dataCache.size,
      memoryUsage: `${Math.round((this.chartPool.size * 2 + this.dataCache.size) / 1024 * 100) / 100} KB`
    };
  }
  
  /**
   * Destroy all charts and cleanup
   */
  public destroyAll(): void {
    for (const [, instance] of this.chartPool) {
      instance.chart.destroy();
    }
    this.chartPool.clear();
    this.dataCache.clear();
  }
}