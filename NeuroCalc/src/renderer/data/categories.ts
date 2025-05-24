import { SubstanceCategory, Substance } from '../types';

// Extended category interface for safety information
interface ExtendedSubstanceCategory extends SubstanceCategory {
  detailedDescription: string;
  safetyLevel: 'low' | 'moderate' | 'high' | 'extreme';
  commonEffects: string[];
  safetyWarnings: string[];
  medicalUse: boolean;
}

export const substanceCategories: ExtendedSubstanceCategory[] = [
  {
    id: 'stimulant',
    name: 'Stimulants',
    icon: '⚡',
    description: 'Substances that increase alertness, attention, and energy',
    detailedDescription: 'Stimulants work by increasing neurotransmitter activity, particularly dopamine and norepinephrine. They can enhance focus, reduce fatigue, and increase physical and mental performance.',
    color: '#EF4444', // Red
    safetyLevel: 'moderate',
    commonEffects: ['Increased alertness', 'Enhanced focus', 'Elevated heart rate', 'Reduced appetite'],
    safetyWarnings: ['Risk of dependency', 'Cardiovascular strain', 'Sleep disruption', 'Potential for abuse'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'medication',
    name: 'Medications',
    icon: '💊',
    description: 'Prescription medications for treating various conditions',
    detailedDescription: 'Medications work by altering neurotransmitter levels, particularly serotonin, norepinephrine, and dopamine, to improve mood and emotional regulation or treat specific medical conditions.',
    color: '#06B6D4', // Cyan
    safetyLevel: 'low',
    commonEffects: ['Therapeutic effects', 'Improved symptoms', 'Mood stabilization', 'Better function'],
    safetyWarnings: ['Prescription required', 'Side effects possible', 'Withdrawal syndrome', 'Drug interactions'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'depressant',
    name: 'Depressants',
    icon: '🌙',
    description: 'Substances that reduce arousal and stimulation',
    detailedDescription: 'Depressants slow down the central nervous system, often enhancing GABA activity. They promote relaxation, reduce anxiety, and can induce sedation.',
    color: '#3B82F6', // Blue
    safetyLevel: 'high',
    commonEffects: ['Sedation', 'Muscle relaxation', 'Reduced anxiety', 'Impaired coordination'],
    safetyWarnings: ['High risk of dependency', 'Respiratory depression', 'Dangerous with alcohol', 'Withdrawal can be life-threatening'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'psychedelic',
    name: 'Psychedelics',
    icon: '🌈',
    description: 'Substances that alter perception and consciousness',
    detailedDescription: 'Psychedelics primarily affect serotonin systems, causing profound changes in perception, thought, and emotional experience. Effects can be unpredictable.',
    color: '#8B5CF6', // Purple
    safetyLevel: 'high',
    commonEffects: ['Visual distortions', 'Altered time perception', 'Emotional intensity', 'Spiritual experiences'],
    safetyWarnings: ['Unpredictable psychological effects', 'Risk of panic attacks', 'Potential for psychosis', 'Dangerous in unstable environments'],
    medicalUse: false,
    substances: []
  },
  {
    id: 'dissociative',
    name: 'Dissociatives',
    icon: '🌀',
    description: 'Substances that cause feelings of detachment from reality',
    detailedDescription: 'Dissociatives work primarily through NMDA receptor antagonism, causing feelings of detachment from the body and environment.',
    color: '#F59E0B', // Amber
    safetyLevel: 'high',
    commonEffects: ['Detachment from reality', 'Out-of-body experiences', 'Anesthesia', 'Memory impairment'],
    safetyWarnings: ['Risk of accidents due to dissociation', 'Potential for psychological dependence', 'Bladder damage with chronic use', 'Dangerous in combination with other substances'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'mood-stabilizer',
    name: 'Mood Stabilizers',
    icon: '⚖️',
    description: 'Medications used to treat bipolar disorder and mood swings',
    detailedDescription: 'Mood stabilizers help regulate mood episodes in bipolar disorder by affecting neurotransmitter systems and neural excitability. They prevent both manic and depressive episodes.',
    color: '#059669', // Emerald
    safetyLevel: 'low',
    commonEffects: ['Mood stabilization', 'Reduced mood swings', 'Prevention of episodes', 'Emotional regulation'],
    safetyWarnings: ['Requires regular blood monitoring', 'Potential kidney/liver effects', 'Drug interactions', 'Pregnancy considerations'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'antihypertensive',
    name: 'Blood Pressure Medications',
    icon: '🫀',
    description: 'Medications used to treat high blood pressure and cardiovascular conditions',
    detailedDescription: 'Antihypertensive medications work through various mechanisms to reduce blood pressure, including vasodilation, diuresis, and cardiac output reduction.',
    color: '#DC2626', // Red
    safetyLevel: 'low',
    commonEffects: ['Reduced blood pressure', 'Improved circulation', 'Reduced cardiac workload', 'Vascular protection'],
    safetyWarnings: ['Monitor blood pressure regularly', 'Risk of hypotension', 'Electrolyte imbalances', 'Gradual discontinuation required'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'other',
    name: 'Other Substances',
    icon: '⚗️',
    description: 'Miscellaneous substances that don\'t fit standard categories',
    detailedDescription: 'Various substances with unique mechanisms of action that don\'t fit neatly into traditional pharmacological categories.',
    color: '#6B7280', // Gray
    safetyLevel: 'moderate',
    commonEffects: ['Variable effects', 'Substance-specific actions'],
    safetyWarnings: ['Research individual substances carefully', 'Effects may be unpredictable', 'Safety profiles vary widely'],
    medicalUse: false,
    substances: []
  }
];

// Substance IDs for each category based on actual data
// Note: Substances can appear in multiple categories due to crossover effects
export const categorySubstances = {
  stimulant: [
    'caffeine',
    'adderall',
    'ritalin', 
    'vyvanse',
    'modafinil',
    'nicotine',
    'wellbutrin',  // Crossover: NDRI with stimulant properties
    'kratom'       // Crossover: Stimulant effects at low doses
  ],
  medication: [
    'wellbutrin',
    'prozac',
    'zoloft', 
    'lexapro',
    'adderall',
    'ritalin',
    'vyvanse',
    'ketamine',    // Crossover: FDA-approved for treatment-resistant depression
    'xanax',       // Crossover: Prescription medication
    'valium'       // Crossover: Prescription medication
  ],
  depressant: [
    'alcohol',
    'xanax',
    'valium',
    'melatonin',   // Crossover: Sleep-inducing effects
    'l-theanine',  // Crossover: Calming/relaxing effects
    'phenibut',    // Crossover: GABA effects, sedating
    'kratom'       // Crossover: Sedating at higher doses
  ],
  psychedelic: [
    'lsd',
    'psilocybin',
    'dmt',         // Crossover: Classic psychedelic compound
    'cannabis',    // Crossover: Can produce psychedelic effects at higher doses
    'ketamine'     // Crossover: Psychedelic therapy applications
  ],
  dissociative: [
    'ketamine',
    'dxm',
    'pcp',
    'nitrous-oxide',
    'salvia'       // Crossover: Dissociative-like effects via kappa-opioid
  ],
  other: [
    'cannabis',
    'cbd',
    'kratom',
    'melatonin',
    'l-theanine',
    'phenibut',
    'dmt',
    'salvia'
  ]
};

// Helper function to get category by ID
export function getCategoryById(id: string): SubstanceCategory | undefined {
  return substanceCategories.find(category => category.id === id);
}

// Helper function to get substances for a category
export function getSubstancesForCategory(categoryId: string, allSubstances: Substance[]): Substance[] {
  // Use manual mapping to support crossover substances in multiple categories
  const categorySubstanceIds = categorySubstances[categoryId as keyof typeof categorySubstances];
  if (!categorySubstanceIds) return [];
  
  return categorySubstanceIds
    .map(id => allSubstances.find(substance => 
      substance.id === id || 
      substance.name.toLowerCase().replace(/\s+/g, '-') === id ||
      substance.aliases.some(alias => alias.toLowerCase().replace(/\s+/g, '-') === id)
    ))
    .filter((substance): substance is Substance => substance !== undefined)
    .slice(0, 10);
}

// Helper function to populate categories with actual substances
export function populateCategoriesWithSubstances(allSubstances: Substance[]): ExtendedSubstanceCategory[] {
  return substanceCategories.map(category => ({
    ...category,
    substances: getSubstancesForCategory(category.id, allSubstances)
  }));
}