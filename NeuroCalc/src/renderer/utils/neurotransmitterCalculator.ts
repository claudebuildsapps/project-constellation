import { Substance, NeurotransmitterEffect, TransmitterActivity, TimePoint, MechanismOfAction } from '../types';

/**
 * Core neurotransmitter effects calculation engine
 * Implements dose-response modeling and time-course predictions
 */
export class NeurotransmitterCalculator {
  /**
   * Calculate neurotransmitter effects for a given substance and dosage
   */
  static calculateEffects(
    substance: Substance,
    dosage: number,
    route: string
  ): NeurotransmitterEffect {
    const dosageRange = substance.dosageRanges.find(dr => dr.route === route);
    if (!dosageRange) {
      throw new Error(`Route ${route} not available for ${substance.name}`);
    }

    // Calculate dose intensity (0-1 scale based on dosage ranges)
    const doseIntensity = this.calculateDoseIntensity(dosage, dosageRange);
    
    // Calculate effects for each neurotransmitter system
    const norepinephrine = this.calculateTransmitterActivity('NET', substance.mechanisms, doseIntensity, substance.pharmacokinetics);
    const dopamine = this.calculateTransmitterActivity('DAT', substance.mechanisms, doseIntensity, substance.pharmacokinetics);
    const serotonin = this.calculateTransmitterActivity('SERT', substance.mechanisms, doseIntensity, substance.pharmacokinetics);

    return {
      substance: substance.id,
      dosage,
      route,
      timestamp: Date.now(),
      effects: {
        norepinephrine,
        dopamine,
        serotonin
      },
      confidence: this.calculateConfidence(substance, dosage, dosageRange),
      source: 'cached'
    };
  }

  /**
   * Calculate dose intensity on a 0-1 scale
   */
  private static calculateDoseIntensity(dosage: number, dosageRange: any): number {
    if (dosage <= dosageRange.threshold) return 0;
    if (dosage <= dosageRange.light) return 0.2;
    if (dosage <= dosageRange.common) return 0.5;
    if (dosage <= dosageRange.strong) return 0.8;
    if (dosage <= dosageRange.heavy) return 1.0;
    
    // Beyond heavy dose - cap at 1.0 but flag as dangerous
    return 1.0;
  }

  /**
   * Calculate activity for a specific neurotransmitter system
   */
  private static calculateTransmitterActivity(
    target: 'DAT' | 'SERT' | 'NET',
    mechanisms: MechanismOfAction[],
    doseIntensity: number,
    pharmacokinetics: any
  ): TransmitterActivity {
    const relevantMechanisms = mechanisms.filter(m => m.target === target);
    
    let reuptakeInhibition = 0;
    let additionalRelease = 0;

    // Calculate effects based on mechanisms
    relevantMechanisms.forEach(mechanism => {
      const effectMagnitude = mechanism.affinity * doseIntensity;
      
      if (mechanism.type === 'inhibition') {
        reuptakeInhibition += effectMagnitude * 100; // Convert to percentage
      } else if (mechanism.type === 'release') {
        additionalRelease += effectMagnitude * 100;
      }
    });

    // Cap at realistic maximums
    reuptakeInhibition = Math.min(reuptakeInhibition, 95);
    additionalRelease = Math.min(additionalRelease, 300);

    // Calculate combined net activity
    const netActivity = (reuptakeInhibition + additionalRelease) / 2;

    // Generate time profile
    const timeProfile = this.generateTimeProfile(netActivity, pharmacokinetics);

    return {
      reuptakeInhibition,
      additionalRelease,
      netActivity,
      timeProfile
    };
  }

  /**
   * Generate effect time profile based on pharmacokinetics
   */
  private static generateTimeProfile(peakEffect: number, pharmacokinetics: any): TimePoint[] {
    const points: TimePoint[] = [];
    const onsetTime = (pharmacokinetics.onset.min + pharmacokinetics.onset.max) / 2;
    const peakTime = (pharmacokinetics.peak.min + pharmacokinetics.peak.max) / 2;
    const duration = (pharmacokinetics.duration.min + pharmacokinetics.duration.max) / 2 * 60; // Convert to minutes

    // Pre-onset
    points.push({ time: 0, intensity: 0 });
    
    // Onset
    points.push({ time: onsetTime, intensity: 0.1 });
    
    // Rise to peak
    const risePoints = 3;
    for (let i = 1; i <= risePoints; i++) {
      const time = onsetTime + (peakTime - onsetTime) * (i / risePoints);
      const intensity = 0.1 + (0.9 * (i / risePoints));
      points.push({ time, intensity });
    }
    
    // Peak
    points.push({ time: peakTime, intensity: 1.0 });
    
    // Decay
    const decayPoints = 8;
    for (let i = 1; i <= decayPoints; i++) {
      const time = peakTime + (duration - peakTime) * (i / decayPoints);
      const intensity = Math.exp(-i * 0.3); // Exponential decay
      points.push({ time, intensity });
    }
    
    // End
    points.push({ time: duration, intensity: 0 });

    return points;
  }

  /**
   * Calculate confidence level for the prediction
   */
  private static calculateConfidence(substance: Substance, dosage: number, dosageRange: any): number {
    let confidence = 0.8; // Base confidence

    // Higher confidence for well-studied ranges
    if (dosage >= dosageRange.light && dosage <= dosageRange.strong) {
      confidence += 0.15;
    }

    // Lower confidence for extreme doses
    if (dosage > dosageRange.heavy) {
      confidence -= 0.3;
    }

    // Lower confidence for substances with fewer mechanisms
    if (substance.mechanisms.length < 2) {
      confidence -= 0.1;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Calculate drug interaction effects (placeholder for future implementation)
   */
  static calculateInteractions(effects: NeurotransmitterEffect[]): any {
    // TODO: Implement drug interaction modeling
    return {
      hasInteractions: false,
      riskLevel: 'low',
      warnings: []
    };
  }

  /**
   * Generate dose-response curve data for visualization
   */
  static generateDoseResponseCurve(substance: Substance, route: string, target: 'DAT' | 'SERT' | 'NET'): any {
    const dosageRange = substance.dosageRanges.find(dr => dr.route === route);
    if (!dosageRange) return null;

    const doses = [];
    const responses = [];
    
    // Generate curve from threshold to 2x heavy dose
    const maxDose = dosageRange.heavy * 2;
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const dose = (maxDose / steps) * i;
      doses.push(dose);
      
      const doseIntensity = this.calculateDoseIntensity(dose, dosageRange);
      const activity = this.calculateTransmitterActivity(target, substance.mechanisms, doseIntensity, substance.pharmacokinetics);
      responses.push(activity.netActivity);
    }

    return { doses, responses };
  }
}

/**
 * Enhanced effects cache with database integration
 */
export class EffectsCache {
  private static memoryCache = new Map<string, NeurotransmitterEffect>();
  private static maxMemoryItems = 100;

  static async getCachedEffect(substance: string, dosage: number, route: string): Promise<NeurotransmitterEffect | null> {
    const key = `${substance}_${dosage}_${route}`;
    
    // Check memory cache first
    const memoryResult = this.memoryCache.get(key);
    if (memoryResult) {
      return memoryResult;
    }

    // Check database cache
    try {
      const { database } = await import('../../database/database');
      const dbResult = await database.getCachedEffect(substance, dosage, route);
      
      if (dbResult) {
        // Store in memory cache for faster future access
        this.memoryCache.set(key, dbResult);
        this.maintainMemoryCacheSize();
        return dbResult;
      }
    } catch (error) {
      console.warn('Database cache lookup failed:', error);
    }

    return null;
  }

  static setCachedEffect(effect: NeurotransmitterEffect): void {
    const key = `${effect.substance}_${effect.dosage}_${effect.route}`;
    
    // Store in memory cache
    this.memoryCache.set(key, effect);
    this.maintainMemoryCacheSize();

    // Store in database cache asynchronously
    this.saveToDatabaseCache(effect).catch(error => {
      console.warn('Failed to save to database cache:', error);
    });
  }

  static precomputeCommonEffects(substances: Substance[]): void {
    substances.forEach(substance => {
      substance.dosageRanges.forEach(dosageRange => {
        // Pre-compute for common dosage points
        [dosageRange.light, dosageRange.common, dosageRange.strong].forEach(dose => {
          const effect = NeurotransmitterCalculator.calculateEffects(substance, dose, dosageRange.route);
          this.setCachedEffect(effect);
        });
      });
    });
  }

  static clearMemoryCache(): void {
    this.memoryCache.clear();
  }

  static getMemoryCacheStats(): { size: number; maxSize: number; keys: string[] } {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxMemoryItems,
      keys: Array.from(this.memoryCache.keys())
    };
  }

  private static maintainMemoryCacheSize(): void {
    while (this.memoryCache.size > this.maxMemoryItems) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }
  }

  private static async saveToDatabaseCache(effect: NeurotransmitterEffect): Promise<void> {
    try {
      const { database } = await import('../../database/database');
      await database.cacheEffect(effect);
    } catch (error) {
      console.error('Failed to save effect to database:', error);
    }
  }
}