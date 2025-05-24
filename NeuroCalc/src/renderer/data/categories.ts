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
    id: 'stimulants',
    name: 'Stimulants',
    icon: '💊',
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
    id: 'depressants',
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
    id: 'hallucinogens',
    name: 'Hallucinogens',
    icon: '🌈',
    description: 'Substances that alter perception and consciousness',
    detailedDescription: 'Hallucinogens primarily affect serotonin systems, causing profound changes in perception, thought, and emotional experience. Effects can be unpredictable.',
    color: '#8B5CF6', // Purple
    safetyLevel: 'high',
    commonEffects: ['Visual distortions', 'Altered time perception', 'Emotional intensity', 'Spiritual experiences'],
    safetyWarnings: ['Unpredictable psychological effects', 'Risk of panic attacks', 'Potential for psychosis', 'Dangerous in unstable environments'],
    medicalUse: false,
    substances: []
  },
  {
    id: 'opioids',
    name: 'Opioids',
    icon: '💉',
    description: 'Pain-relieving substances that affect opioid receptors',
    detailedDescription: 'Opioids bind to opioid receptors in the brain and spinal cord, providing powerful pain relief but also producing euphoria and physical dependence.',
    color: '#F59E0B', // Amber
    safetyLevel: 'extreme',
    commonEffects: ['Pain relief', 'Euphoria', 'Drowsiness', 'Constipation'],
    safetyWarnings: ['Extremely high addiction potential', 'Respiratory depression', 'Overdose risk', 'Severe withdrawal symptoms'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'anxiolytics',
    name: 'Anxiolytics',
    icon: '🧘',
    description: 'Substances used to treat anxiety and promote calmness',
    detailedDescription: 'Anxiolytics work primarily through GABA enhancement, reducing anxiety and promoting calm. Many are also used as muscle relaxants and sleep aids.',
    color: '#10B981', // Green
    safetyLevel: 'moderate',
    commonEffects: ['Reduced anxiety', 'Calm feeling', 'Muscle relaxation', 'Improved sleep'],
    safetyWarnings: ['Dependency potential', 'Cognitive impairment', 'Fall risk in elderly', 'Interaction with alcohol'],
    medicalUse: true,
    substances: []
  },
  {
    id: 'antidepressants',
    name: 'Antidepressants',
    icon: '💭',
    description: 'Substances used to treat depression and mood disorders',
    detailedDescription: 'Antidepressants work by altering neurotransmitter levels, particularly serotonin, norepinephrine, and dopamine, to improve mood and emotional regulation.',
    color: '#06B6D4', // Cyan
    safetyLevel: 'low',
    commonEffects: ['Improved mood', 'Reduced anxiety', 'Better sleep', 'Increased energy'],
    safetyWarnings: ['Initial worsening of symptoms', 'Suicidal ideation in young adults', 'Withdrawal syndrome', 'Sexual side effects'],
    medicalUse: true,
    substances: []
  }
];

// Top 10 substances for each category as specified in the specification
export const categorySubstances = {
  stimulants: [
    'caffeine',
    'adderall', // Amphetamine
    'ritalin', // Methylphenidate
    'vyvanse', // Lisdexamfetamine
    'cocaine',
    'methamphetamine',
    'nicotine',
    'modafinil',
    'mdma',
    'ephedrine'
  ],
  depressants: [
    'alcohol',
    'xanax', // Alprazolam
    'valium', // Diazepam
    'ambien', // Zolpidem
    'klonopin', // Clonazepam
    'ativan', // Lorazepam
    'barbiturates',
    'ghb',
    'rohypnol',
    'melatonin'
  ],
  hallucinogens: [
    'lsd',
    'psilocybin',
    'dmt',
    'mescaline',
    'ketamine',
    'pcp',
    'salvia',
    '2c-b',
    'ayahuasca',
    'dxm'
  ],
  opioids: [
    'morphine',
    'oxycodone',
    'heroin',
    'fentanyl',
    'codeine',
    'hydrocodone',
    'tramadol',
    'methadone',
    'buprenorphine',
    'kratom'
  ],
  anxiolytics: [
    'xanax', // Alprazolam
    'valium', // Diazepam
    'klonopin', // Clonazepam
    'ativan', // Lorazepam
    'buspirone',
    'propranolol',
    'hydroxyzine',
    'l-theanine',
    'gabapentin',
    'cbd'
  ],
  antidepressants: [
    'prozac', // Fluoxetine
    'zoloft', // Sertraline
    'lexapro', // Escitalopram
    'wellbutrin', // Bupropion
    'paxil', // Paroxetine
    'cymbalta', // Duloxetine
    'effexor', // Venlafaxine
    'celexa', // Citalopram
    'trazodone',
    'st-johns-wort'
  ]
};

// Helper function to get category by ID
export function getCategoryById(id: string): SubstanceCategory | undefined {
  return substanceCategories.find(category => category.id === id);
}

// Helper function to get substances for a category
export function getSubstancesForCategory(categoryId: string, allSubstances: Substance[]): Substance[] {
  const categorySubstanceIds = categorySubstances[categoryId as keyof typeof categorySubstances];
  if (!categorySubstanceIds) return [];
  
  return categorySubstanceIds
    .map(id => allSubstances.find(substance => 
      substance.id === id || 
      substance.name.toLowerCase().replace(/\s+/g, '-') === id ||
      substance.aliases.some(alias => alias.toLowerCase().replace(/\s+/g, '-') === id)
    ))
    .filter((substance): substance is Substance => substance !== undefined)
    .slice(0, 10); // Ensure we only return top 10
}

// Helper function to populate categories with actual substances
export function populateCategoriesWithSubstances(allSubstances: Substance[]): ExtendedSubstanceCategory[] {
  return substanceCategories.map(category => ({
    ...category,
    substances: getSubstancesForCategory(category.id, allSubstances)
  }));
}