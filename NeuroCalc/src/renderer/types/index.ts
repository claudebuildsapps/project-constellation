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
  source: 'cached' | 'llm' | 'user' | 'calculated';
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
  view: NavigationView;
  substances: Substance[];
  llmConfig: LLMConfig;
  comparison: ComparisonState;
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
export type NavigationView = 'substances' | 'explorer' | 'compare' | 'effects' | 'settings' | 'about' | 'help';

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

// Comparison types
export interface ComparisonState {
  selectedSubstances: (Substance | null)[];
  comparisonMode: 'table' | 'visual' | 'interaction';
  activeRoute: string;
  activeDosages: Record<string, number>;
  interactions: InteractionWarning[];
  presets: ComparisonPreset[];
  maxSubstances: number;
}

export interface InteractionWarning {
  substances: [string, string];
  severity: 'info' | 'caution' | 'warning' | 'danger';
  type: 'synergy' | 'antagonism' | 'contraindication' | 'timing' | 'unknown';
  description: string;
  recommendations: string[];
  sources?: string[];
  confidence: number; // 0-1
}

export interface ComparisonPreset {
  id: string;
  name: string;
  substances: string[];
  dosages: Record<string, number>;
  route: string;
  notes?: string;
  created: Date;
  modified?: Date;
  tags?: string[];
}

export interface ComparisonResult {
  substances: Substance[];
  effects: NeurotransmitterEffect[];
  interactions: InteractionWarning[];
  safetyScore: number; // 0-100
  recommendation: 'safe' | 'caution' | 'warning' | 'danger';
  timestamp: number;
}

export interface SubstanceComparison {
  primary: Substance;
  secondary: Substance;
  dosages: {
    primary: number;
    secondary: number;
  };
  route: string;
  interactions: InteractionWarning[];
  combinedEffects?: NeurotransmitterEffect;
}

export interface ComparisonMetrics {
  similarityScore: number; // 0-1
  safetyRisk: number; // 0-1
  interactionPotential: number; // 0-1
  neurotransmitterOverlap: {
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
  };
}

// Comparison visualization types
export interface RadarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    substance: string;
  }[];
}

export interface ComparisonChartData {
  type: 'radar' | 'bar' | 'line' | 'scatter';
  data: any;
  options: any;
  substances: string[];
}

// Enhanced comparison types for detailed analysis
export interface DetailedSubstanceComparison {
  primary: {
    substance: Substance;
    dosage: number;
    route: string;
    unit: string;
    effects: NeurotransmitterEffect;
    pharmacokinetics: PharmacokineticData;
  };
  secondary: {
    substance: Substance;
    dosage: number;
    route: string;
    unit: string;
    effects: NeurotransmitterEffect;
    pharmacokinetics: PharmacokineticData;
  };
  comparison: {
    neurotransmitterDeltas: {
      dopamine: number;
      serotonin: number;
      norepinephrine: number;
    };
    effectSimilarity: number;
    timeProfileComparison: TimeProfileComparison;
    pharmacokineticDifferences: PharmacokineticComparison;
    riskProfile: ComparisonRiskProfile;
  };
}

export interface TimeProfileComparison {
  onsetDifference: number; // minutes
  peakDifference: number; // minutes
  durationDifference: number; // hours
  overlapPeriod: {
    start: number;
    end: number;
    intensity: number;
  };
  timeline: {
    primary: TimePoint[];
    secondary: TimePoint[];
    combined: TimePoint[];
  };
}

export interface PharmacokineticComparison {
  absorption: {
    onsetRatio: number;
    bioavailabilityDifference: number;
  };
  distribution: {
    peakTimeRatio: number;
    volumeDistributionRatio?: number;
  };
  metabolism: {
    halfLifeRatio: number;
    clearanceRatio?: number;
  };
  elimination: {
    durationRatio: number;
    eliminationRateDifference: number;
  };
}

export interface ComparisonRiskProfile {
  overallRisk: 'low' | 'moderate' | 'high' | 'extreme';
  riskFactors: {
    cardiovascular: number; // 0-1
    neurotoxicity: number; // 0-1
    addiction: number; // 0-1
    interactions: number; // 0-1
  };
  recommendations: string[];
  contraindications: string[];
  monitoringRequired: string[];
}

export interface ComparisonCalculationResult {
  success: boolean;
  comparison?: DetailedSubstanceComparison;
  error?: string;
  warnings: string[];
  calculationTime: number;
  confidence: number; // 0-1
}

export interface ComparisonVisualizationData {
  radarChart: {
    neurotransmitters: RadarChartData;
    pharmacokinetics: RadarChartData;
    safety: RadarChartData;
  };
  timelineChart: {
    labels: string[];
    datasets: {
      primary: ChartDataset;
      secondary: ChartDataset;
      combined?: ChartDataset;
    };
  };
  heatmapData: {
    rows: string[];
    columns: string[];
    values: number[][];
    colorScale: string[];
  };
}

export interface ComparisonExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'csv' | 'json';
  includeCharts: boolean;
  includeRawData: boolean;
  includeCalculations: boolean;
  customTitle?: string;
  notes?: string;
}

export interface ComparisonHistory {
  id: string;
  timestamp: number;
  comparison: DetailedSubstanceComparison;
  userNotes?: string;
  tags: string[];
  favorite: boolean;
}