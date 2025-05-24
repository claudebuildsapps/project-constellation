import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, Substance, NeurotransmitterEffect, LLMConfig, NavigationView } from '../types';
import { initialSubstances } from '../data/substances';
import { createLLMService } from '../utils/llmService';

interface AppStore extends AppState {
  // Actions
  setSelectedSubstance: (substance: Substance | null) => void;
  setDosage: (dosage: number) => void;
  setRoute: (route: string) => void;
  setUnit: (unit: string) => void;
  setEffects: (effects: NeurotransmitterEffect | null) => void;
  setCalculating: (calculating: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: NavigationView) => void;
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  calculateEffects: () => Promise<void>;
  resetState: () => void;
}

const initialState: AppState = {
  selectedSubstance: null,
  currentDosage: 0,
  currentRoute: 'oral',
  currentUnit: 'mg',
  effects: null,
  isCalculating: false,
  error: null,
  view: 'substances',
  substances: initialSubstances,
  llmConfig: {
    endpoint: '',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 1000,
    enabled: false,
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setSelectedSubstance: (substance) => {
        set((state) => {
          const newState: Partial<AppState> = { 
            selectedSubstance: substance,
            effects: null,
            error: null 
          };
          
          // Set default dosage and route based on substance
          if (substance && substance.dosageRanges.length > 0) {
            const defaultRange = substance.dosageRanges[0];
            newState.currentRoute = defaultRange.route;
            newState.currentUnit = defaultRange.unit;
            newState.currentDosage = defaultRange.common;
          }
          
          return newState;
        });

        // Auto-calculate effects when substance is selected
        if (substance) {
          // Use setTimeout to ensure state is updated before calculating
          setTimeout(() => {
            get().calculateEffects();
          }, 0);
        }
      },

      setDosage: (dosage) => {
        set({ currentDosage: dosage, effects: null });
      },

      setRoute: (route) => {
        set((state) => {
          const newState: Partial<AppState> = { currentRoute: route, effects: null };
          
          // Update unit based on route if substance has different units for different routes
          if (state.selectedSubstance) {
            const routeRange = state.selectedSubstance.dosageRanges.find(r => r.route === route);
            if (routeRange) {
              newState.currentUnit = routeRange.unit;
              newState.currentDosage = routeRange.common;
            }
          }
          
          return newState;
        });
      },

      setUnit: (unit) => {
        set({ currentUnit: unit, effects: null });
      },

      setEffects: (effects) => {
        set({ effects });
      },

      setCalculating: (calculating) => {
        set({ isCalculating: calculating });
      },

      setError: (error) => {
        set({ error });
      },

      setView: (view) => {
        set({ view });
      },

      updateLLMConfig: (config) => {
        set((state) => ({
          llmConfig: { ...state.llmConfig, ...config }
        }));
      },

      calculateEffects: async () => {
        const state = get();
        const { selectedSubstance, currentDosage, currentRoute, llmConfig } = state;
        
        if (!selectedSubstance) return;
        
        set({ isCalculating: true, error: null });
        
        try {
          // First, try to get cached results
          const cachedEffect = await getCachedEffect(
            selectedSubstance.id,
            currentDosage,
            currentRoute
          );
          
          if (cachedEffect) {
            set({ effects: cachedEffect, isCalculating: false });
            return;
          }
          
          // If LLM is enabled and configured, use it
          if (llmConfig.enabled && llmConfig.endpoint && llmConfig.apiKey) {
            const llmEffect = await calculateWithLLM(
              selectedSubstance,
              currentDosage,
              currentRoute,
              llmConfig
            );
            set({ effects: llmEffect, isCalculating: false });
          } else {
            // Use basic calculation
            const basicEffect = calculateBasicEffect(
              selectedSubstance,
              currentDosage,
              currentRoute
            );
            set({ effects: basicEffect, isCalculating: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Calculation failed',
            isCalculating: false 
          });
        }
      },

      resetState: () => {
        set(initialState);
      },
    }),
    { name: 'neurocalc-store' }
  )
);

// Helper functions
async function getCachedEffect(
  substanceId: string,
  dosage: number,
  route: string
): Promise<NeurotransmitterEffect | null> {
  // TODO: Implement database lookup
  return null;
}

async function calculateWithLLM(
  substance: Substance,
  dosage: number,
  route: string,
  config: LLMConfig
): Promise<NeurotransmitterEffect> {
  const llmService = createLLMService(config);
  
  try {
    const analysis = await llmService.analyzeSubstance(substance, dosage, route);
    return analysis.effects;
  } catch (error) {
    console.error('LLM calculation failed:', error);
    // Fallback to basic calculation with lower confidence
    const basicEffect = calculateBasicEffect(substance, dosage, route);
    basicEffect.confidence = 0.3; // Lower confidence for fallback
    return basicEffect;
  }
}

function calculateBasicEffect(
  substance: Substance,
  dosage: number,
  route: string
): NeurotransmitterEffect {
  // Basic calculation based on substance mechanisms
  const effects = {
    norepinephrine: { 
      reuptakeInhibition: 0, 
      additionalRelease: 0, 
      netActivity: 0, 
      timeProfile: [] as { time: number; intensity: number }[] 
    },
    dopamine: { 
      reuptakeInhibition: 0, 
      additionalRelease: 0, 
      netActivity: 0, 
      timeProfile: [] as { time: number; intensity: number }[] 
    },
    serotonin: { 
      reuptakeInhibition: 0, 
      additionalRelease: 0, 
      netActivity: 0, 
      timeProfile: [] as { time: number; intensity: number }[] 
    },
  };
  
  // Apply substance-specific calculations
  substance.mechanisms.forEach(mechanism => {
    const doseRatio = calculateDoseRatio(substance, dosage, route);
    
    switch (mechanism.target) {
      case 'DAT':
        if (mechanism.type === 'inhibition') {
          effects.dopamine.reuptakeInhibition = Math.min(100, doseRatio * 50);
        } else if (mechanism.type === 'release') {
          effects.dopamine.additionalRelease = doseRatio * 100;
        }
        break;
      case 'SERT':
        if (mechanism.type === 'inhibition') {
          effects.serotonin.reuptakeInhibition = Math.min(100, doseRatio * 40);
        } else if (mechanism.type === 'release') {
          effects.serotonin.additionalRelease = doseRatio * 80;
        }
        break;
      case 'NET':
        if (mechanism.type === 'inhibition') {
          effects.norepinephrine.reuptakeInhibition = Math.min(100, doseRatio * 60);
        } else if (mechanism.type === 'release') {
          effects.norepinephrine.additionalRelease = doseRatio * 120;
        }
        break;
    }
  });
  
  // Calculate net activity
  Object.values(effects).forEach(effect => {
    effect.netActivity = effect.reuptakeInhibition + (effect.additionalRelease * 0.5);
    effect.timeProfile = generateTimeProfile(substance, effect.netActivity);
  });
  
  return {
    substance: substance.id,
    dosage,
    route,
    timestamp: Date.now(),
    effects,
    confidence: 0.6, // Basic calculation has moderate confidence
    source: 'cached',
  };
}

function calculateDoseRatio(substance: Substance, dosage: number, route: string): number {
  const range = substance.dosageRanges.find(r => r.route === route);
  if (!range) return 0;
  
  if (dosage <= range.threshold) return 0;
  if (dosage <= range.light) return 0.25;
  if (dosage <= range.common) return 0.5;
  if (dosage <= range.strong) return 0.75;
  return Math.min(1.5, 1 + (dosage - range.strong) / range.strong);
}

function generateTimeProfile(substance: Substance, intensity: number): { time: number; intensity: number }[] {
  const profile: { time: number; intensity: number }[] = [];
  
  // Use default values if pharmacokinetics is not defined
  if (!substance.pharmacokinetics) {
    return [
      { time: 0, intensity: 0 },
      { time: 30, intensity: intensity * 0.5 },
      { time: 60, intensity: intensity },
      { time: 120, intensity: intensity * 0.8 },
      { time: 240, intensity: intensity * 0.3 },
      { time: 360, intensity: 0 }
    ];
  }
  
  const { onset, peak, duration } = substance.pharmacokinetics;
  
  const onsetTime = (onset.min + onset.max) / 2;
  const peakTime = (peak.min + peak.max) / 2;
  const durationTime = (duration.min + duration.max) / 2 * 60; // Convert to minutes
  
  for (let t = 0; t <= durationTime; t += 15) {
    let relativeIntensity = 0;
    
    if (t < onsetTime) {
      relativeIntensity = (t / onsetTime) * 0.1;
    } else if (t < peakTime) {
      relativeIntensity = 0.1 + ((t - onsetTime) / (peakTime - onsetTime)) * 0.9;
    } else {
      const decay = Math.exp(-(t - peakTime) / (durationTime - peakTime));
      relativeIntensity = decay;
    }
    
    profile.push({
      time: t,
      intensity: Math.max(0, relativeIntensity * intensity / 100),
    });
  }
  
  return profile;
}