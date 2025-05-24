// Core substance and effect types
export interface Substance {
  id: string;
  name: string;
  aliases: string[];
  category: 'stimulant' | 'depressant' | 'medication' | 'psychedelic' | 'dissociative' | 'other';
  description: string;
  mechanisms: MechanismOfAction[];
  dosageRanges: DosageRange[];
  pharmacokinetics?: PharmacokineticData;
  warnings?: string[];
  color: string;
  interactions?: string[];
  precautions?: string[];
  onsetTimes?: Record<string, any>;
  halfLife?: number;
  bioavailability?: number;
}

export interface MechanismOfAction {
  target: 'DAT' | 'SERT' | 'NET' | 'receptor';
  type: 'inhibition' | 'release' | 'agonist' | 'antagonist';
  affinity: number; // IC50 or Ki value
  description: string;
}

export interface DosageRange {
  route: 'oral' | 'nasal' | 'iv' | 'sublingual' | 'topical';
  unit: 'mg' | 'ug' | 'ml' | 'units';
  threshold: number;
  light: number;
  common: number;
  strong: number;
  heavy: number;
}

export interface PharmacokineticData {
  onset: {
    min: number; // minutes
    max: number;
  };
  peak: {
    min: number;
    max: number;
  };
  duration: {
    min: number; // hours
    max: number;
  };
  halfLife: {
    min: number;
    max: number;
  };
}

export interface NeurotransmitterEffect {
  substance: string;
  dosage: number;
  route: string;
  timestamp: number;
  effects: {
    norepinephrine: TransmitterActivity;
    dopamine: TransmitterActivity;
    serotonin: TransmitterActivity;
  };
  confidence: number; // 0-1
  source: 'cached' | 'llm' | 'user';
}

export interface TransmitterActivity {
  reuptakeInhibition: number; // % inhibition (0-100)
  additionalRelease: number;  // % increase (0-infinity)
  netActivity: number;        // Combined effect score
  timeProfile: { time: number; intensity: number }[];   // Effect over time
}

export interface TimePoint {
  time: number; // minutes from administration
  intensity: number; // 0-1 relative intensity
}

// UI State types
export interface AppState {
  selectedSubstance: Substance | null;
  currentDosage: number;
  currentRoute: string;
  currentUnit: string;
  effects: NeurotransmitterEffect | null;
  isCalculating: boolean;
  error: string | null;
  view: 'substances' | 'explorer' | 'effects' | 'settings' | 'about' | 'help';
  substances: Substance[];
  llmConfig: LLMConfig;
}

export interface LLMConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

// Chart and visualization types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
  tension?: number;
}

// API and database types
export interface CalculationRequest {
  substance: string;
  dosage: number;
  route: string;
  unit: string;
}

export interface CalculationResponse {
  success: boolean;
  data?: NeurotransmitterEffect;
  error?: string;
  cached: boolean;
}

// Form and input types
export interface DosageInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
}

export interface RouteSelectProps {
  value: string;
  onChange: (route: string) => void;
  options: string[];
  disabled?: boolean;
}

// Navigation and UI types
export type NavigationView = 'substances' | 'explorer' | 'effects' | 'settings' | 'about' | 'help';

export interface NavigationItem {
  id: NavigationView;
  label: string;
  icon: string;
  description?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Settings types
export interface UserPreferences {
  defaultRoute: string;
  defaultUnit: string;
  autoCalculate: boolean;
  showWarnings: boolean;
  chartType: 'line' | 'bar' | 'area';
  colorScheme: 'light' | 'dark' | 'system';
}

// Safety and validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SafetyCheck {
  level: 'safe' | 'caution' | 'warning' | 'danger';
  message: string;
  recommendations: string[];
}

// Explorer page types
export interface SubstanceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  substances: Substance[];
  color: string;
}