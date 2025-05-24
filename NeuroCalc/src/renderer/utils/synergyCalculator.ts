import { Substance } from '../types';

export interface SynergyEffect {
  combination: string[];
  type: 'synergistic' | 'antagonistic' | 'neutral' | 'potentiation' | 'inhibition';
  magnitude: number; // 0-100, where 50 is neutral
  mechanism: string;
  description: string;
  dosageModifier: number; // multiplier for effective dosage
  riskModifier: number; // multiplier for risk assessment
  confidenceLevel: 'low' | 'medium' | 'high';
  evidenceLevel: 'theoretical' | 'anecdotal' | 'clinical' | 'research';
}

export interface CombinationAnalysis {
  substances: string[];
  overallSynergy: number; // -100 to +100
  effects: SynergyEffect[];
  recommendations: string[];
  optimalRatios?: { [substanceId: string]: number };
  timingRecommendations?: string[];
}

class SynergyCalculator {
  private static neurotransmitterSynergies: { [key: string]: { [key: string]: number } } = {
    'serotonin': {
      'serotonin': 1.8, // Strong synergy between serotonergics
      'dopamine': 1.3, // Moderate synergy
      'norepinephrine': 1.2,
      'gaba': 0.8, // Potential antagonism
      'acetylcholine': 1.1,
      'histamine': 1.0
    },
    'dopamine': {
      'dopamine': 1.6, // Strong synergy between dopaminergics
      'serotonin': 1.3,
      'norepinephrine': 1.4,
      'gaba': 0.7, // Antagonistic
      'acetylcholine': 0.9,
      'histamine': 1.0
    },
    'gaba': {
      'gaba': 2.0, // Very strong synergy - dangerous
      'serotonin': 0.8,
      'dopamine': 0.7,
      'norepinephrine': 0.6,
      'acetylcholine': 0.9,
      'histamine': 1.1
    },
    'norepinephrine': {
      'norepinephrine': 1.5,
      'dopamine': 1.4,
      'serotonin': 1.2,
      'gaba': 0.6,
      'acetylcholine': 1.0,
      'histamine': 1.0
    }
  };

  private static mechanismSynergies: { [key: string]: { [key: string]: SynergyEffect } } = {
    'psychedelic + psychedelic': {
      pattern: 'serotonin.*serotonin',
      combination: ['LSD', 'Psilocybin'],
      type: 'synergistic',
      magnitude: 85,
      mechanism: '5-HT2A receptor cross-tolerance reduction and enhanced downstream signaling',
      description: 'Psychedelic combinations often produce exponentially intensified effects',
      dosageModifier: 0.3, // Reduce dose to 30% of normal
      riskModifier: 1.8,
      confidenceLevel: 'high',
      evidenceLevel: 'anecdotal'
    },
    'stimulant + stimulant': {
      pattern: 'dopamine.*dopamine',
      combination: ['Amphetamine', 'Cocaine'],
      type: 'synergistic',
      magnitude: 75,
      mechanism: 'Additive dopamine reuptake inhibition and release enhancement',
      description: 'Stimulant combinations increase cardiovascular risk exponentially',
      dosageModifier: 0.5,
      riskModifier: 2.2,
      confidenceLevel: 'high',
      evidenceLevel: 'clinical'
    },
    'depressant + depressant': {
      pattern: 'gaba.*gaba',
      combination: ['Alcohol', 'Benzodiazepine'],
      type: 'synergistic',
      magnitude: 95,
      mechanism: 'Additive GABA-A receptor enhancement leading to respiratory depression',
      description: 'CNS depressant combinations are potentially fatal',
      dosageModifier: 0.2,
      riskModifier: 3.0,
      confidenceLevel: 'high',
      evidenceLevel: 'research'
    },
    'maoi + serotonin': {
      pattern: 'MAOI.*serotonin|serotonin.*MAOI',
      combination: ['Harmine', 'MDMA'],
      type: 'potentiation',
      magnitude: 90,
      mechanism: 'MAO inhibition prevents serotonin breakdown, causing dangerous accumulation',
      description: 'MAOI combinations can cause serotonin syndrome',
      dosageModifier: 0.1,
      riskModifier: 4.0,
      confidenceLevel: 'high',
      evidenceLevel: 'research'
    },
    'cannabis + psychedelic': {
      pattern: 'THC.*serotonin|cannabis.*psychedelic',
      combination: ['Cannabis', 'LSD'],
      type: 'synergistic',
      magnitude: 70,
      mechanism: 'CB1 receptor modulation of 5-HT2A signaling pathways',
      description: 'Cannabis intensifies and prolongs psychedelic experiences unpredictably',
      dosageModifier: 0.7,
      riskModifier: 1.4,
      confidenceLevel: 'medium',
      evidenceLevel: 'anecdotal'
    }
  };

  static calculateSynergy(substances: (Substance | null)[]): CombinationAnalysis {
    const validSubstances = substances.filter((s): s is Substance => s !== null);
    
    if (validSubstances.length < 2) {
      return {
        substances: validSubstances.map(s => s.name),
        overallSynergy: 0,
        effects: [],
        recommendations: ['Add more substances to analyze synergy']
      };
    }

    const effects: SynergyEffect[] = [];
    let totalSynergy = 0;
    let effectCount = 0;

    // Calculate pairwise synergies
    for (let i = 0; i < validSubstances.length; i++) {
      for (let j = i + 1; j < validSubstances.length; j++) {
        const substance1 = validSubstances[i];
        const substance2 = validSubstances[j];
        
        const pairEffects = this.calculatePairSynergy(substance1, substance2);
        effects.push(...pairEffects);
        
        pairEffects.forEach(effect => {
          totalSynergy += (effect.magnitude - 50); // Normalize around 50
          effectCount++;
        });
      }
    }

    // Calculate neurotransmitter-based synergies
    const ntSynergies = this.calculateNeurotransmitterSynergies(validSubstances);
    effects.push(...ntSynergies);
    
    ntSynergies.forEach(effect => {
      totalSynergy += (effect.magnitude - 50);
      effectCount++;
    });

    const overallSynergy = effectCount > 0 ? totalSynergy / effectCount : 0;
    const recommendations = this.generateSynergyRecommendations(effects, overallSynergy);
    const optimalRatios = this.calculateOptimalRatios(validSubstances, effects);
    const timingRecommendations = this.generateTimingRecommendations(validSubstances, effects);

    return {
      substances: validSubstances.map(s => s.name),
      overallSynergy,
      effects,
      recommendations,
      optimalRatios,
      timingRecommendations
    };
  }

  private static calculatePairSynergy(substance1: Substance, substance2: Substance): SynergyEffect[] {
    const effects: SynergyEffect[] = [];

    // Check mechanism-based synergies
    for (const [key, template] of Object.entries(this.mechanismSynergies)) {
      const regex = new RegExp(template.pattern, 'i');
      const combined = `${substance1.class} ${substance2.class}`;
      
      if (regex.test(combined) || 
          regex.test(`${substance1.name} ${substance2.name}`) ||
          regex.test(`${substance1.mechanisms?.join(' ') || ''} ${substance2.mechanisms?.join(' ') || ''}`)) {
        
        effects.push({
          combination: [substance1.name, substance2.name],
          type: template.type,
          magnitude: template.magnitude,
          mechanism: template.mechanism,
          description: template.description,
          dosageModifier: template.dosageModifier,
          riskModifier: template.riskModifier,
          confidenceLevel: template.confidenceLevel,
          evidenceLevel: template.evidenceLevel
        });
      }
    }

    // If no specific mechanism match, calculate basic neurotransmitter synergy
    if (effects.length === 0) {
      const basicSynergy = this.calculateBasicSynergy(substance1, substance2);
      if (basicSynergy) {
        effects.push(basicSynergy);
      }
    }

    return effects;
  }

  private static calculateBasicSynergy(substance1: Substance, substance2: Substance): SynergyEffect | null {
    if (!substance1.neurotransmitters || !substance2.neurotransmitters) {
      return null;
    }

    let totalSynergy = 0;
    let interactions = 0;

    Object.keys(substance1.neurotransmitters).forEach(nt1 => {
      Object.keys(substance2.neurotransmitters).forEach(nt2 => {
        const synergyValue = this.neurotransmitterSynergies[nt1]?.[nt2];
        if (synergyValue) {
          totalSynergy += synergyValue;
          interactions++;
        }
      });
    });

    if (interactions === 0) return null;

    const avgSynergy = totalSynergy / interactions;
    const magnitude = Math.min(Math.max((avgSynergy - 1) * 50 + 50, 0), 100);

    return {
      combination: [substance1.name, substance2.name],
      type: avgSynergy > 1.2 ? 'synergistic' : avgSynergy < 0.8 ? 'antagonistic' : 'neutral',
      magnitude,
      mechanism: 'Neurotransmitter system interaction',
      description: this.getBasicSynergyDescription(avgSynergy),
      dosageModifier: avgSynergy > 1.2 ? 0.7 : avgSynergy < 0.8 ? 1.3 : 1.0,
      riskModifier: avgSynergy > 1.5 ? 1.5 : 1.0,
      confidenceLevel: 'medium',
      evidenceLevel: 'theoretical'
    };
  }

  private static calculateNeurotransmitterSynergies(substances: Substance[]): SynergyEffect[] {
    const ntCounts = new Map<string, Substance[]>();
    
    substances.forEach(substance => {
      if (substance.neurotransmitters) {
        Object.keys(substance.neurotransmitters).forEach(nt => {
          if (!ntCounts.has(nt)) {
            ntCounts.set(nt, []);
          }
          ntCounts.get(nt)!.push(substance);
        });
      }
    });

    const effects: SynergyEffect[] = [];

    ntCounts.forEach((substanceList, nt) => {
      if (substanceList.length > 1) {
        // Multiple substances affecting same neurotransmitter
        const intensity = Math.min(substanceList.length * 20, 100);
        const riskMultiplier = nt === 'gaba' ? 3.0 : nt === 'serotonin' ? 2.0 : 1.5;
        
        effects.push({
          combination: substanceList.map(s => s.name),
          type: 'synergistic',
          magnitude: 50 + intensity,
          mechanism: `Multiple substances affecting ${nt} neurotransmitter system`,
          description: `${substanceList.length} substances targeting ${nt} - increased risk of oversaturation`,
          dosageModifier: 1 / substanceList.length,
          riskModifier: riskMultiplier,
          confidenceLevel: 'high',
          evidenceLevel: 'clinical'
        });
      }
    });

    return effects;
  }

  private static calculateOptimalRatios(substances: Substance[], effects: SynergyEffect[]): { [substanceId: string]: number } {
    const ratios: { [substanceId: string]: number } = {};
    
    substances.forEach(substance => {
      let totalModifier = 1.0;
      let modifierCount = 0;

      effects.forEach(effect => {
        if (effect.combination.includes(substance.name)) {
          totalModifier *= effect.dosageModifier;
          modifierCount++;
        }
      });

      const avgModifier = modifierCount > 0 ? Math.pow(totalModifier, 1/modifierCount) : 1.0;
      ratios[substance.id] = Math.max(0.1, Math.min(1.0, avgModifier));
    });

    return ratios;
  }

  private static generateSynergyRecommendations(effects: SynergyEffect[], overallSynergy: number): string[] {
    const recommendations: string[] = [];

    if (overallSynergy > 30) {
      recommendations.push('🔥 STRONG SYNERGY: Significantly reduce all dosages');
      recommendations.push('Start with 25-50% of normal individual doses');
    } else if (overallSynergy > 10) {
      recommendations.push('📈 MODERATE SYNERGY: Reduce dosages by 20-30%');
      recommendations.push('Monitor effects carefully as they develop');
    } else if (overallSynergy < -10) {
      recommendations.push('📉 ANTAGONISTIC: Effects may be reduced or unpredictable');
      recommendations.push('Consider spacing substances or using alternatives');
    } else {
      recommendations.push('⚖️ NEUTRAL INTERACTION: Standard dosing may apply');
      recommendations.push('Still recommend starting conservatively');
    }

    const highRiskEffects = effects.filter(e => e.riskModifier > 2.0);
    if (highRiskEffects.length > 0) {
      recommendations.push('⚠️ HIGH RISK COMBINATION DETECTED');
      recommendations.push('Have emergency contacts and reversal agents available');
    }

    const potentiationEffects = effects.filter(e => e.type === 'potentiation');
    if (potentiationEffects.length > 0) {
      recommendations.push('🚨 POTENTIATION WARNING: One substance dramatically enhances the other');
      recommendations.push('Extreme caution required - consider avoiding combination');
    }

    return recommendations;
  }

  private static generateTimingRecommendations(substances: Substance[], effects: SynergyEffect[]): string[] {
    const recommendations: string[] = [];

    const hasGABA = substances.some(s => s.neurotransmitters?.gaba);
    const hasStimulant = substances.some(s => s.class.toLowerCase().includes('stimulant'));
    const hasPsychedelic = substances.some(s => s.class.toLowerCase().includes('psychedelic'));

    if (hasGABA && hasStimulant) {
      recommendations.push('⏰ TIMING CRITICAL: Never combine CNS depressants with stimulants simultaneously');
      recommendations.push('If using both, space by at least 6-8 hours and use minimal doses');
    }

    if (hasPsychedelic && substances.length > 1) {
      recommendations.push('🕐 SEQUENTIAL DOSING: Consider staggered dosing for psychedelic combinations');
      recommendations.push('Allow 30-60 minutes between substances to gauge initial effects');
    }

    const fastOnset = substances.filter(s => s.routes.some(r => r.duration?.onset && r.duration.onset < 30));
    const slowOnset = substances.filter(s => s.routes.some(r => r.duration?.onset && r.duration.onset > 60));

    if (fastOnset.length > 0 && slowOnset.length > 0) {
      recommendations.push('⚡ ONSET TIMING: Fast-acting substances should be dosed after slow-acting ones');
      recommendations.push('This prevents over-dosing during onset delays');
    }

    return recommendations;
  }

  private static getBasicSynergyDescription(synergy: number): string {
    if (synergy > 1.5) return 'Strong synergistic interaction expected';
    if (synergy > 1.2) return 'Moderate synergistic interaction likely';
    if (synergy < 0.7) return 'Antagonistic interaction - effects may be reduced';
    if (synergy < 0.9) return 'Mild antagonistic interaction possible';
    return 'Neutral interaction - minimal synergy expected';
  }

  static getSynergyTypes(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'synergistic', label: 'Synergistic', color: '#ff9800' },
      { value: 'antagonistic', label: 'Antagonistic', color: '#2196f3' },
      { value: 'neutral', label: 'Neutral', color: '#9e9e9e' },
      { value: 'potentiation', label: 'Potentiation', color: '#f44336' },
      { value: 'inhibition', label: 'Inhibition', color: '#9c27b0' }
    ];
  }

  static getConfidenceLevels(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'low', label: 'Low Confidence', color: '#ffeb3b' },
      { value: 'medium', label: 'Medium Confidence', color: '#ff9800' },
      { value: 'high', label: 'High Confidence', color: '#4caf50' }
    ];
  }
}

export default SynergyCalculator;