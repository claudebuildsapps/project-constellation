import { Substance } from '../types';

export const initialSubstances: Substance[] = [
  {
    id: 'nicotine',
    name: 'Nicotine',
    aliases: ['Tobacco', 'Cigarettes', 'Vaping'],
    category: 'stimulant',
    description: 'A naturally occurring alkaloid found in tobacco plants. Acts as a nicotinic acetylcholine receptor agonist.',
    color: '#8B4513',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 1.0,
        description: 'Nicotinic acetylcholine receptor agonist, indirectly increases dopamine release'
      },
      {
        target: 'DAT',
        type: 'release',
        affinity: 0.3,
        description: 'Indirect dopamine release through nAChR activation'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 0.5,
        light: 1,
        common: 2,
        strong: 4,
        heavy: 8
      },
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 0.25,
        light: 0.5,
        common: 1,
        strong: 2,
        heavy: 4
      }
    ],
    pharmacokinetics: {
      onset: { min: 1, max: 3 },
      peak: { min: 5, max: 15 },
      duration: { min: 0.5, max: 2 },
      halfLife: { min: 1, max: 2 }
    },
    warnings: [
      'Highly addictive substance',
      'Cardiovascular effects at higher doses',
      'May interact with medications'
    ]
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    aliases: ['Coffee', 'Tea', 'Energy drinks'],
    category: 'stimulant',
    description: 'A central nervous system stimulant and adenosine receptor antagonist found in coffee, tea, and many other plants.',
    color: '#8B4513',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.8,
        description: 'Adenosine receptor antagonist, indirectly increases dopamine'
      },
      {
        target: 'DAT',
        type: 'release',
        affinity: 0.2,
        description: 'Weak indirect dopamine release'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 20,
        light: 50,
        common: 100,
        strong: 200,
        heavy: 400
      }
    ],
    pharmacokinetics: {
      onset: { min: 15, max: 30 },
      peak: { min: 30, max: 60 },
      duration: { min: 3, max: 6 },
      halfLife: { min: 3, max: 7 }
    },
    warnings: [
      'May cause anxiety and jitters at high doses',
      'Can disrupt sleep patterns',
      'Tolerance develops with regular use'
    ]
  },
  {
    id: 'bupropion',
    name: 'Bupropion',
    aliases: ['Wellbutrin', 'Zyban'],
    category: 'medication',
    description: 'An atypical antidepressant that acts as a norepinephrine-dopamine reuptake inhibitor (NDRI).',
    color: '#4169E1',
    mechanisms: [
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.7,
        description: 'Dopamine reuptake inhibition'
      },
      {
        target: 'NET',
        type: 'inhibition',
        affinity: 0.8,
        description: 'Norepinephrine reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 37.5,
        light: 75,
        common: 150,
        strong: 300,
        heavy: 450
      }
    ],
    pharmacokinetics: {
      onset: { min: 60, max: 120 },
      peak: { min: 180, max: 360 },
      duration: { min: 12, max: 24 },
      halfLife: { min: 12, max: 30 }
    },
    warnings: [
      'Prescription medication - consult healthcare provider',
      'May lower seizure threshold',
      'Can cause dry mouth and insomnia'
    ]
  },
  {
    id: 'adderall',
    name: 'Adderall',
    aliases: ['Amphetamine', 'Mixed amphetamine salts'],
    category: 'medication',
    description: 'A combination of amphetamine salts used to treat ADHD. Acts as a powerful stimulant affecting multiple neurotransmitter systems.',
    color: '#FF6B35',
    mechanisms: [
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.9,
        description: 'Strong dopamine reuptake inhibition'
      },
      {
        target: 'DAT',
        type: 'release',
        affinity: 0.8,
        description: 'Reverses dopamine transporter, causing release'
      },
      {
        target: 'NET',
        type: 'inhibition',
        affinity: 0.8,
        description: 'Norepinephrine reuptake inhibition'
      },
      {
        target: 'NET',
        type: 'release',
        affinity: 0.7,
        description: 'Causes norepinephrine release'
      },
      {
        target: 'SERT',
        type: 'inhibition',
        affinity: 0.3,
        description: 'Weak serotonin reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 2.5,
        light: 5,
        common: 10,
        strong: 20,
        heavy: 40
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 60 },
      peak: { min: 60, max: 180 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 8, max: 12 }
    },
    warnings: [
      'Controlled substance - prescription required',
      'High potential for abuse and dependence',
      'Cardiovascular risks at high doses',
      'May cause hypertension and tachycardia'
    ]
  }
];