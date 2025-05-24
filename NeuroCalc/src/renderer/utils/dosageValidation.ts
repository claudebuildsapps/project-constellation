import { Substance, DosageRange } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  level?: 'threshold' | 'light' | 'common' | 'strong' | 'dangerous';
  safetyRisk?: 'low' | 'medium' | 'high' | 'extreme';
}

export interface DosageConstraints {
  min: number;
  max: number;
  step: number;
  unit: string;
  route: string;
  warnings: {
    light: string;
    common: string;
    strong: string;
    dangerous: string;
  };
}

// Main validation function
export const validateDosage = (
  substance: Substance,
  dosage: number,
  route: string,
  unit: string
): ValidationResult => {
  // Find the appropriate dosage range for the route
  const range = substance.dosageRanges.find(r => r.route === route);
  
  if (!range) {
    return {
      isValid: false,
      error: `No dosage information available for ${route} route`,
    };
  }

  // Check unit compatibility
  if (range.unit !== unit) {
    const convertedDosage = convertDosageUnit(dosage, unit, range.unit);
    if (convertedDosage === null) {
      return {
        isValid: false,
        error: `Cannot convert from ${unit} to ${range.unit}`,
      };
    }
    // Use converted dosage for validation
    dosage = convertedDosage;
  }

  // Validate against range constraints
  return validateAgainstRange(dosage, range, substance);
};

// Validate dosage against a specific range
export const validateAgainstRange = (
  dosage: number,
  range: DosageRange,
  substance: Substance
): ValidationResult => {
  if (dosage < 0) {
    return {
      isValid: false,
      error: 'Dosage cannot be negative',
    };
  }

  if (dosage === 0) {
    return {
      isValid: true,
      level: 'threshold',
      warning: 'No effect expected at zero dosage',
    };
  }

  // Check threshold
  if (dosage <= range.threshold) {
    return {
      isValid: true,
      level: 'threshold',
      safetyRisk: 'low',
      warning: 'Below threshold - minimal or no effects expected',
    };
  }

  // Check light dose
  if (dosage <= range.light) {
    return {
      isValid: true,
      level: 'light',
      safetyRisk: 'low',
    };
  }

  // Check common dose
  if (dosage <= range.common) {
    return {
      isValid: true,
      level: 'common',
      safetyRisk: 'low',
    };
  }

  // Check strong dose
  if (dosage <= range.strong) {
    return {
      isValid: true,
      level: 'strong',
      safetyRisk: 'medium',
      warning: 'Strong dose - increased risk of side effects',
    };
  }

  // Dangerous territory
  const dangerousMultiplier = 2.0; // More than 2x strong dose is dangerous
  const lethalMultiplier = 3.0; // More than 3x strong dose is potentially lethal
  
  if (dosage <= range.strong * dangerousMultiplier) {
    return {
      isValid: false,
      level: 'dangerous',
      safetyRisk: 'high',
      error: 'DANGEROUS: Dosage exceeds safe limits',
      warning: `This dose is ${(dosage / range.strong).toFixed(1)}x the strong dose`,
    };
  }

  if (dosage <= range.strong * lethalMultiplier) {
    return {
      isValid: false,
      level: 'dangerous',
      safetyRisk: 'extreme',
      error: 'EXTREMELY DANGEROUS: Potentially lethal dosage',
      warning: `This dose is ${(dosage / range.strong).toFixed(1)}x the strong dose`,
    };
  }

  return {
    isValid: false,
    level: 'dangerous',
    safetyRisk: 'extreme',
    error: 'LETHAL RANGE: Do not use this dosage',
    warning: `This dose is ${(dosage / range.strong).toFixed(1)}x the strong dose`,
  };
};

// Get dosage constraints for UI components
export const getDosageConstraints = (
  substance: Substance,
  route: string
): DosageConstraints | null => {
  const range = substance.dosageRanges.find(r => r.route === route);
  
  if (!range) return null;

  const step = calculateOptimalStep(range);
  const max = range.strong * 1.5; // Allow up to 1.5x strong dose in UI

  return {
    min: 0,
    max,
    step,
    unit: range.unit,
    route,
    warnings: {
      light: `Light dose (${range.threshold}-${range.light}${range.unit})`,
      common: `Common dose (${range.light}-${range.common}${range.unit})`,
      strong: `Strong dose (${range.common}-${range.strong}${range.unit})`,
      dangerous: `Dangerous (>${range.strong}${range.unit})`,
    },
  };
};

// Calculate optimal step size for input controls
const calculateOptimalStep = (range: DosageRange): number => {
  const maxValue = range.strong;
  
  if (maxValue < 1) return 0.01;
  if (maxValue < 10) return 0.1;
  if (maxValue < 100) return 1;
  if (maxValue < 1000) return 5;
  return 10;
};

// Unit conversion utilities
export const convertDosageUnit = (
  value: number,
  fromUnit: string,
  toUnit: string
): number | null => {
  const conversionTable: Record<string, Record<string, number>> = {
    'mg': {
      'μg': 1000,
      'g': 0.001,
      'mg': 1,
    },
    'μg': {
      'mg': 0.001,
      'g': 0.000001,
      'μg': 1,
    },
    'g': {
      'mg': 1000,
      'μg': 1000000,
      'g': 1,
    },
  };

  if (!conversionTable[fromUnit] || !conversionTable[fromUnit][toUnit]) {
    return null; // Unsupported conversion
  }

  return value * conversionTable[fromUnit][toUnit];
};

// Get available units for a substance
export const getAvailableUnits = (substance: Substance): string[] => {
  return [...new Set(substance.dosageRanges.map(r => r.unit))];
};

// Get available routes for a substance
export const getAvailableRoutes = (substance: Substance): string[] => {
  return substance.dosageRanges.map(r => r.route);
};

// Format dosage for display
export const formatDosage = (
  dosage: number,
  unit: string,
  precision: number = 2
): string => {
  if (dosage === 0) return `0 ${unit}`;
  
  // Use appropriate precision based on value
  if (dosage < 1) {
    return `${dosage.toFixed(precision)} ${unit}`;
  } else if (dosage < 10) {
    return `${dosage.toFixed(1)} ${unit}`;
  } else {
    return `${Math.round(dosage)} ${unit}`;
  }
};

// Get dosage recommendations
export const getDosageRecommendations = (
  substance: Substance,
  route: string,
  experience: 'beginner' | 'experienced' | 'expert' = 'beginner'
): { recommended: number; min: number; max: number; unit: string } | null => {
  const range = substance.dosageRanges.find(r => r.route === route);
  
  if (!range) return null;

  const recommendations = {
    beginner: {
      recommended: range.light,
      min: range.threshold,
      max: range.common,
    },
    experienced: {
      recommended: range.common,
      min: range.light,
      max: range.strong,
    },
    expert: {
      recommended: range.common,
      min: range.common,
      max: range.strong,
    },
  };

  return {
    ...recommendations[experience],
    unit: range.unit,
  };
};