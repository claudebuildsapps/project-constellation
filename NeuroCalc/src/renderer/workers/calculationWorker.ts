/**
 * Web Worker for heavy calculation tasks
 * Prevents UI blocking during complex similarity and comparison calculations
 */

import { 
  NeurotransmitterEffect, 
  Substance, 
  ComparisonMetrics,
  TransmitterActivity 
} from '../types';

// Worker message types
interface CalculationMessage {
  type: 'CALCULATE_SIMILARITY' | 'CALCULATE_COMPARISON_BATCH' | 'CALCULATE_DTW';
  id: string;
  payload: any;
}

interface SimilarityPayload {
  primary: NeurotransmitterEffect;
  secondary: NeurotransmitterEffect;
  primarySubstance: Substance;
  secondarySubstance: Substance;
}

interface BatchComparisonPayload {
  substances: Substance[];
  targetSubstance: Substance;
  batchSize: number;
}

// Heavy calculation functions (moved from main thread)
function calculateSimilarityInWorker(payload: SimilarityPayload): ComparisonMetrics {
  const { primary, secondary, primarySubstance, secondarySubstance } = payload;
  
  // Similarity calculation logic (intensive computation)
  const similarityScore = calculateOverallSimilarity(primary, secondary);
  const safetyRisk = calculateSafetyRisk(primarySubstance, secondarySubstance);
  const interactionPotential = calculateInteractionPotential(primary, secondary);
  const neurotransmitterOverlap = calculateNeurotransmitterOverlap(primary, secondary);
  
  return {
    similarityScore,
    safetyRisk,
    interactionPotential,
    neurotransmitterOverlap,
  };
}

function calculateOverallSimilarity(
  primary: NeurotransmitterEffect,
  secondary: NeurotransmitterEffect
): number {
  const weights = {
    neurotransmitterProfile: 0.4,
    dosageResponse: 0.25,
    temporalPattern: 0.2,
    confidence: 0.15
  };

  // Neurotransmitter profile similarity using cosine similarity
  const profileSimilarity = calculateCosineSimilarity(
    primary.neurotransmitterActivity,
    secondary.neurotransmitterActivity
  );

  // Dosage response similarity
  const dosageSimilarity = calculateDosageResponseSimilarity(primary, secondary);

  // Temporal pattern similarity
  const temporalSimilarity = calculateTemporalSimilarity(primary, secondary);

  // Confidence factor
  const confidenceFactor = Math.min(primary.confidence, secondary.confidence) / 100;

  const weightedScore = 
    profileSimilarity * weights.neurotransmitterProfile +
    dosageSimilarity * weights.dosageResponse +
    temporalSimilarity * weights.temporalPattern +
    confidenceFactor * weights.confidence;

  return Math.round(weightedScore * 100) / 100;
}

function calculateCosineSimilarity(
  profile1: TransmitterActivity,
  profile2: TransmitterActivity
): number {
  const transmitters = ['dopamine', 'serotonin', 'norepinephrine', 'gaba', 'glutamate', 'acetylcholine'];
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const transmitter of transmitters) {
    const val1 = (profile1 as any)[transmitter] || 0;
    const val2 = (profile2 as any)[transmitter] || 0;
    
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

function calculateDosageResponseSimilarity(
  primary: NeurotransmitterEffect,
  secondary: NeurotransmitterEffect
): number {
  // Implementation for dosage response similarity
  return 0.8; // Placeholder
}

function calculateTemporalSimilarity(
  primary: NeurotransmitterEffect,
  secondary: NeurotransmitterEffect
): number {
  // Implementation for temporal pattern similarity
  return 0.75; // Placeholder
}

function calculateSafetyRisk(substance1: Substance, substance2: Substance): number {
  // Safety risk calculation
  const warnings1 = (substance1.warnings || []).length;
  const warnings2 = (substance2.warnings || []).length;
  return Math.min(1, (warnings1 + warnings2) / 10);
}

function calculateInteractionPotential(
  primary: NeurotransmitterEffect,
  secondary: NeurotransmitterEffect
): number {
  // Interaction potential calculation
  return 0.6; // Placeholder
}

function calculateNeurotransmitterOverlap(
  primary: NeurotransmitterEffect,
  secondary: NeurotransmitterEffect
): number {
  // Neurotransmitter overlap calculation
  return 0.7; // Placeholder
}

// Batch processing for multiple comparisons
function processBatchComparisons(payload: BatchComparisonPayload): ComparisonMetrics[] {
  const { substances, targetSubstance, batchSize } = payload;
  const results: ComparisonMetrics[] = [];
  
  for (let i = 0; i < Math.min(substances.length, batchSize); i++) {
    const substance = substances[i];
    if (substance.id !== targetSubstance.id) {
      // Simulate calculation (would use actual effect data)
      const result = calculateSimilarityInWorker({
        primary: {} as NeurotransmitterEffect, // Would get actual data
        secondary: {} as NeurotransmitterEffect,
        primarySubstance: targetSubstance,
        secondarySubstance: substance
      });
      results.push(result);
    }
  }
  
  return results;
}

// Worker event listener
self.addEventListener('message', (event: MessageEvent<CalculationMessage>) => {
  const { type, id, payload } = event.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'CALCULATE_SIMILARITY':
        result = calculateSimilarityInWorker(payload as SimilarityPayload);
        break;
        
      case 'CALCULATE_COMPARISON_BATCH':
        result = processBatchComparisons(payload as BatchComparisonPayload);
        break;
        
      case 'CALCULATE_DTW':
        // Dynamic Time Warping calculation
        result = calculateDTW(payload.series1, payload.series2);
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      type: 'CALCULATION_COMPLETE',
      id,
      result,
      success: true
    });
    
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'CALCULATION_ERROR',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
});

// DTW calculation for time series comparison
function calculateDTW(series1: number[], series2: number[]): number {
  const n = series1.length;
  const m = series2.length;
  
  // Single array optimization instead of 2D matrix
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

export {};