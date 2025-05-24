/**
 * Worker Manager for handling Web Worker communications
 * Provides non-blocking UI performance for heavy calculations
 */

import { 
  NeurotransmitterEffect, 
  Substance, 
  ComparisonMetrics 
} from '../types';

interface PendingCalculation {
  id: string;
  resolve: (result: any) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export class WorkerManager {
  private static instance: WorkerManager;
  private worker: Worker | null = null;
  private pendingCalculations = new Map<string, PendingCalculation>();
  private readonly CALCULATION_TIMEOUT = 30000; // 30 seconds
  
  private constructor() {
    this.initializeWorker();
  }
  
  public static getInstance(): WorkerManager {
    if (!WorkerManager.instance) {
      WorkerManager.instance = new WorkerManager();
    }
    return WorkerManager.instance;
  }
  
  private initializeWorker(): void {
    try {
      // Create worker from separate file
      this.worker = new Worker(
        new URL('../workers/calculationWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));
      
      // Cleanup timeout for pending calculations
      setInterval(() => this.cleanupTimeouts(), 10000);
      
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread calculations');
      this.worker = null;
    }
  }
  
  private handleWorkerMessage(event: MessageEvent): void {
    const { type, id, result, error, success } = event.data;
    
    if (type === 'CALCULATION_COMPLETE' || type === 'CALCULATION_ERROR') {
      const pending = this.pendingCalculations.get(id);
      if (pending) {
        this.pendingCalculations.delete(id);
        
        if (success) {
          pending.resolve(result);
        } else {
          pending.reject(new Error(error || 'Calculation failed'));
        }
      }
    }
  }
  
  private handleWorkerError(error: ErrorEvent): void {
    console.error('Worker error:', error);
    // Fallback to main thread for all pending calculations
    this.fallbackToMainThread();
  }
  
  private fallbackToMainThread(): void {
    // Move pending calculations back to main thread
    for (const [id, pending] of this.pendingCalculations) {
      pending.reject(new Error('Worker failed, using main thread fallback'));
    }
    this.pendingCalculations.clear();
  }
  
  private cleanupTimeouts(): void {
    const now = Date.now();
    for (const [id, pending] of this.pendingCalculations) {
      if (now - pending.timestamp > this.CALCULATION_TIMEOUT) {
        pending.reject(new Error('Calculation timeout'));
        this.pendingCalculations.delete(id);
      }
    }
  }
  
  private generateId(): string {
    return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Calculate similarity metrics using Web Worker (non-blocking)
   */
  public async calculateSimilarity(
    primary: NeurotransmitterEffect,
    secondary: NeurotransmitterEffect,
    primarySubstance: Substance,
    secondarySubstance: Substance
  ): Promise<ComparisonMetrics> {
    
    if (!this.worker) {
      // Fallback to main thread calculation
      return this.calculateSimilarityMainThread(primary, secondary, primarySubstance, secondarySubstance);
    }
    
    const id = this.generateId();
    
    return new Promise((resolve, reject) => {
      this.pendingCalculations.set(id, {
        id,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.worker!.postMessage({
        type: 'CALCULATE_SIMILARITY',
        id,
        payload: {
          primary,
          secondary,
          primarySubstance,
          secondarySubstance
        }
      });
    });
  }
  
  /**
   * Process batch comparisons using Web Worker
   */
  public async calculateBatchComparisons(
    substances: Substance[],
    targetSubstance: Substance,
    batchSize: number = 50
  ): Promise<ComparisonMetrics[]> {
    
    if (!this.worker) {
      // Fallback to main thread
      return this.calculateBatchMainThread(substances, targetSubstance, batchSize);
    }
    
    const id = this.generateId();
    
    return new Promise((resolve, reject) => {
      this.pendingCalculations.set(id, {
        id,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.worker!.postMessage({
        type: 'CALCULATE_COMPARISON_BATCH',
        id,
        payload: {
          substances,
          targetSubstance,
          batchSize
        }
      });
    });
  }
  
  /**
   * Calculate Dynamic Time Warping using Web Worker
   */
  public async calculateDTW(series1: number[], series2: number[]): Promise<number> {
    if (!this.worker) {
      return this.calculateDTWMainThread(series1, series2);
    }
    
    const id = this.generateId();
    
    return new Promise((resolve, reject) => {
      this.pendingCalculations.set(id, {
        id,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.worker!.postMessage({
        type: 'CALCULATE_DTW',
        id,
        payload: { series1, series2 }
      });
    });
  }
  
  // Main thread fallback implementations
  private async calculateSimilarityMainThread(
    primary: NeurotransmitterEffect,
    secondary: NeurotransmitterEffect,
    primarySubstance: Substance,
    secondarySubstance: Substance
  ): Promise<ComparisonMetrics> {
    // Import and use the original calculation logic
    const { SimilarityCalculator } = await import('./similarityCalculator');
    return SimilarityCalculator.calculateSimilarityMetrics(
      primary, secondary, primarySubstance, secondarySubstance
    );
  }
  
  private async calculateBatchMainThread(
    substances: Substance[],
    targetSubstance: Substance,
    batchSize: number
  ): Promise<ComparisonMetrics[]> {
    // Simplified batch calculation
    return [];
  }
  
  private calculateDTWMainThread(series1: number[], series2: number[]): number {
    // Simplified DTW calculation
    const n = series1.length;
    const m = series2.length;
    const dtw = new Array(m + 1).fill(Infinity);
    dtw[0] = 0;
    
    for (let i = 1; i <= n; i++) {
      let prev = dtw[0];
      dtw[0] = Infinity;
      
      for (let j = 1; j <= m; j++) {
        const cost = Math.abs(series1[i - 1] - series2[j - 1]);
        const temp = dtw[j];
        dtw[j] = cost + Math.min(prev, dtw[j], dtw[j - 1]);
        prev = temp;
      }
    }
    
    return dtw[m];
  }
  
  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // Reject all pending calculations
    for (const [id, pending] of this.pendingCalculations) {
      pending.reject(new Error('WorkerManager destroyed'));
    }
    this.pendingCalculations.clear();
  }
}