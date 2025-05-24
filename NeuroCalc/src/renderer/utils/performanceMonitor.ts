/**
 * Performance monitoring utilities for NeuroCalc
 * Tracks component render times, memory usage, and optimization metrics
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 metrics
  private enabled = process.env.NODE_ENV === 'development';

  constructor() {
    if (this.enabled) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Start timing a performance metric
   */
  startTimer(name: string, metadata?: Record<string, any>): string {
    if (!this.enabled) return '';

    const metricId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.metrics.push(metric);
    return metricId;
  }

  /**
   * End timing for a performance metric
   */
  endTimer(name: string): void {
    if (!this.enabled) return;

    const metric = this.metrics
      .slice()
      .reverse()
      .find(m => m.name === name && !m.endTime);

    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;

      // Log slow operations
      if (metric.duration > 16) { // Slower than 60fps
        console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`, metric);
      }
    }

    // Clean up old metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Measure function execution time
   */
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    if (!this.enabled) return fn();

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metrics.push({
      name,
      startTime,
      endTime,
      duration,
      metadata,
    });

    if (duration > 16) {
      console.warn(`Slow function: ${name} took ${duration.toFixed(2)}ms`, metadata);
    }

    return result;
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage(): MemoryInfo | null {
    if (typeof (performance as any).memory !== 'undefined') {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * Get performance statistics
   */
  getStats(metricName?: string): any {
    if (!this.enabled) return null;

    const targetMetrics = metricName 
      ? this.metrics.filter(m => m.name === metricName && m.duration !== undefined)
      : this.metrics.filter(m => m.duration !== undefined);

    if (targetMetrics.length === 0) return null;

    const durations = targetMetrics.map(m => m.duration!);
    const sorted = durations.sort((a, b) => a - b);

    return {
      count: durations.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: durations.reduce((a, b) => a + b, 0) / durations.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Start monitoring memory usage periodically with proper cleanup
   */
  private memoryInterval: NodeJS.Timeout | null = null;
  
  private startMemoryMonitoring(): void {
    // Clear any existing interval to prevent memory leaks
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    
    this.memoryInterval = setInterval(() => {
      const memory = this.getMemoryUsage();
      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        // Warn if memory usage is high
        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB}MB used of ${totalMB}MB allocated`);
        }
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop memory monitoring and clean up resources
   */
  public cleanup(): void {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }
    this.metrics = [];
  }

  /**
   * Create a React hook for component performance monitoring
   */
  useComponentPerformance(componentName: string) {
    if (!this.enabled) {
      return {
        startRender: () => {},
        endRender: () => {},
        measureRender: (fn: () => any) => fn(),
      };
    }

    return {
      startRender: () => this.startTimer(`${componentName}_render`),
      endRender: () => this.endTimer(`${componentName}_render`),
      measureRender: (fn: () => any) => this.measure(`${componentName}_render`, fn),
    };
  }

  /**
   * Log performance report
   */
  generateReport(): void {
    if (!this.enabled) return;

    console.group('NeuroCalc Performance Report');
    
    const memory = this.getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
      });
    }

    // Group metrics by name
    const metricGroups = this.metrics.reduce((groups, metric) => {
      if (metric.duration !== undefined) {
        if (!groups[metric.name]) groups[metric.name] = [];
        groups[metric.name].push(metric.duration);
      }
      return groups;
    }, {} as Record<string, number[]>);

    Object.entries(metricGroups).forEach(([name, durations]) => {
      if (durations.length > 0) {
        const stats = this.getStats(name);
        console.log(`${name}:`, stats);
      }
    });

    console.groupEnd();
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for component performance monitoring
 */
export const usePerformanceMonitor = (componentName: string) => {
  return performanceMonitor.useComponentPerformance(componentName);
};

/**
 * Higher-order component for automatic performance monitoring
 */
export function withPerformanceMonitoring<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const MemoizedComponent = React.memo((props: P) => {
    const { measureRender } = usePerformanceMonitor(displayName);
    
    return measureRender(() => React.createElement(WrappedComponent, props));
  });

  MemoizedComponent.displayName = `withPerformanceMonitoring(${displayName})`;
  return MemoizedComponent;
}

/**
 * Performance measurement decorator for functions
 */
export function measurePerformance(name: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      return performanceMonitor.measure(`${target.constructor.name}.${propertyKey}`, () => {
        return originalMethod.apply(this, args);
      }, { name });
    };

    return descriptor;
  };
}

// Export for global access in development
if (process.env.NODE_ENV === 'development') {
  (window as any).performanceMonitor = performanceMonitor;
}

export default performanceMonitor;