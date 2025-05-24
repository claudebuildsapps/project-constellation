import { Substance } from '../types';

export const initialSubstances: Substance[] = [
  // STIMULANTS
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
    id: 'adderall',
    name: 'Adderall',
    aliases: ['Amphetamine', 'Mixed amphetamine salts'],
    category: 'stimulant',
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
  },
  {
    id: 'ritalin',
    name: 'Ritalin',
    aliases: ['Methylphenidate', 'Concerta'],
    category: 'stimulant',
    description: 'A psychostimulant medication used to treat ADHD. Blocks dopamine and norepinephrine reuptake.',
    color: '#FF8C00',
    mechanisms: [
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.8,
        description: 'Dopamine reuptake inhibition'
      },
      {
        target: 'NET',
        type: 'inhibition',
        affinity: 0.7,
        description: 'Norepinephrine reuptake inhibition'
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
      peak: { min: 60, max: 120 },
      duration: { min: 3, max: 5 },
      halfLife: { min: 2, max: 4 }
    },
    warnings: [
      'Prescription medication only',
      'May affect growth in children',
      'Can cause insomnia and appetite loss'
    ]
  },
  {
    id: 'vyvanse',
    name: 'Vyvanse',
    aliases: ['Lisdexamfetamine'],
    category: 'stimulant',
    description: 'A prodrug of dextroamphetamine used for ADHD. Converted to active form in the body.',
    color: '#FF4500',
    mechanisms: [
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.85,
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
        threshold: 10,
        light: 20,
        common: 30,
        strong: 50,
        heavy: 70
      }
    ],
    pharmacokinetics: {
      onset: { min: 60, max: 120 },
      peak: { min: 180, max: 300 },
      duration: { min: 8, max: 14 },
      halfLife: { min: 10, max: 13 }
    },
    warnings: [
      'Extended release formulation',
      'Prescription required',
      'Lower abuse potential than immediate release'
    ]
  },
  {
    id: 'modafinil',
    name: 'Modafinil',
    aliases: ['Provigil', 'Modalert'],
    category: 'stimulant',
    description: 'A wakefulness-promoting agent used to treat narcolepsy and shift work sleep disorder.',
    color: '#32CD32',
    mechanisms: [
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.4,
        description: 'Weak dopamine reuptake inhibition'
      },
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.6,
        description: 'Histamine and orexin system activation'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 50,
        light: 100,
        common: 200,
        strong: 400,
        heavy: 600
      }
    ],
    pharmacokinetics: {
      onset: { min: 60, max: 120 },
      peak: { min: 120, max: 240 },
      duration: { min: 8, max: 15 },
      halfLife: { min: 12, max: 15 }
    },
    warnings: [
      'Prescription required',
      'May cause skin reactions',
      'Interacts with birth control'
    ]
  },
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

  // MEDICATIONS (Antidepressants)
  {
    id: 'wellbutrin',
    name: 'Wellbutrin',
    aliases: ['Bupropion', 'Zyban'],
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
    id: 'prozac',
    name: 'Prozac',
    aliases: ['Fluoxetine', 'Sarafem'],
    category: 'medication',
    description: 'A selective serotonin reuptake inhibitor (SSRI) used to treat depression and anxiety disorders.',
    color: '#20B2AA',
    mechanisms: [
      {
        target: 'SERT',
        type: 'inhibition',
        affinity: 0.9,
        description: 'Selective serotonin reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 5,
        light: 10,
        common: 20,
        strong: 40,
        heavy: 80
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 240 },
      peak: { min: 360, max: 480 },
      duration: { min: 24, max: 72 },
      halfLife: { min: 48, max: 216 }
    },
    warnings: [
      'Prescription required',
      'May cause activation in young adults',
      'Long half-life requires careful dosing'
    ]
  },
  {
    id: 'zoloft',
    name: 'Zoloft',
    aliases: ['Sertraline'],
    category: 'medication',
    description: 'An SSRI antidepressant used to treat depression, anxiety, and OCD.',
    color: '#4682B4',
    mechanisms: [
      {
        target: 'SERT',
        type: 'inhibition',
        affinity: 0.85,
        description: 'Selective serotonin reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 12.5,
        light: 25,
        common: 50,
        strong: 100,
        heavy: 200
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 180 },
      peak: { min: 360, max: 480 },
      duration: { min: 24, max: 36 },
      halfLife: { min: 22, max: 36 }
    },
    warnings: [
      'Prescription medication',
      'May cause GI side effects',
      'Gradual dose changes recommended'
    ]
  },
  {
    id: 'lexapro',
    name: 'Lexapro',
    aliases: ['Escitalopram', 'Cipralex'],
    category: 'medication',
    description: 'An SSRI antidepressant that is the S-enantiomer of citalopram.',
    color: '#5F9EA0',
    mechanisms: [
      {
        target: 'SERT',
        type: 'inhibition',
        affinity: 0.88,
        description: 'Highly selective serotonin reuptake inhibition'
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
        heavy: 30
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 180 },
      peak: { min: 300, max: 420 },
      duration: { min: 24, max: 32 },
      halfLife: { min: 27, max: 32 }
    },
    warnings: [
      'Prescription required',
      'Most selective SSRI',
      'Lower drug interaction profile'
    ]
  },

  // DEPRESSANTS
  {
    id: 'alcohol',
    name: 'Alcohol',
    aliases: ['Ethanol', 'Beer', 'Wine', 'Spirits'],
    category: 'depressant',
    description: 'A central nervous system depressant that enhances GABA activity and inhibits glutamate.',
    color: '#CD853F',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.7,
        description: 'GABA-A receptor positive allosteric modulator'
      },
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.6,
        description: 'NMDA receptor antagonist'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'ml',
        threshold: 5,
        light: 15,
        common: 30,
        strong: 60,
        heavy: 120
      }
    ],
    pharmacokinetics: {
      onset: { min: 15, max: 30 },
      peak: { min: 30, max: 90 },
      duration: { min: 2, max: 6 },
      halfLife: { min: 0.5, max: 1.5 }
    },
    warnings: [
      'Highly addictive',
      'Dangerous withdrawal symptoms',
      'Liver toxicity with chronic use',
      'Impairs judgment and coordination'
    ]
  },
  {
    id: 'xanax',
    name: 'Xanax',
    aliases: ['Alprazolam'],
    category: 'depressant',
    description: 'A short-acting benzodiazepine used to treat anxiety and panic disorders.',
    color: '#9370DB',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.9,
        description: 'GABA-A receptor positive allosteric modulator'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 0.125,
        light: 0.25,
        common: 0.5,
        strong: 1,
        heavy: 2
      }
    ],
    pharmacokinetics: {
      onset: { min: 15, max: 30 },
      peak: { min: 60, max: 120 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 6, max: 12 }
    },
    warnings: [
      'High dependency potential',
      'Dangerous withdrawal',
      'Memory impairment',
      'Respiratory depression risk'
    ]
  },
  {
    id: 'valium',
    name: 'Valium',
    aliases: ['Diazepam'],
    category: 'depressant',
    description: 'A long-acting benzodiazepine used for anxiety, muscle spasms, and seizures.',
    color: '#8A2BE2',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.85,
        description: 'GABA-A receptor positive allosteric modulator'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 1,
        light: 2.5,
        common: 5,
        strong: 10,
        heavy: 20
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 60 },
      peak: { min: 60, max: 180 },
      duration: { min: 8, max: 24 },
      halfLife: { min: 20, max: 100 }
    },
    warnings: [
      'Very long half-life',
      'Accumulates with repeated dosing',
      'Dependency potential',
      'Elderly are more sensitive'
    ]
  },

  // PSYCHEDELICS
  {
    id: 'lsd',
    name: 'LSD',
    aliases: ['Acid', 'Lucy', 'Tabs'],
    category: 'psychedelic',
    description: 'A powerful hallucinogen that acts as a serotonin 2A receptor agonist.',
    color: '#FF1493',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.95,
        description: '5-HT2A receptor agonist causing hallucinogenic effects'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'ug',
        threshold: 10,
        light: 25,
        common: 75,
        strong: 150,
        heavy: 300
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 90 },
      peak: { min: 120, max: 240 },
      duration: { min: 6, max: 12 },
      halfLife: { min: 3, max: 5 }
    },
    warnings: [
      'Powerful psychological effects',
      'Risk of panic and psychosis',
      'Set and setting crucial',
      'Illegal in most jurisdictions'
    ]
  },
  {
    id: 'psilocybin',
    name: 'Psilocybin',
    aliases: ['Magic mushrooms', 'Shrooms', 'Mushrooms'],
    category: 'psychedelic',
    description: 'A naturally occurring psychedelic compound found in certain mushrooms.',
    color: '#8B008B',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.9,
        description: '5-HT2A receptor agonist'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 1,
        light: 2.5,
        common: 5,
        strong: 10,
        heavy: 20
      }
    ],
    pharmacokinetics: {
      onset: { min: 20, max: 60 },
      peak: { min: 60, max: 120 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 1, max: 3 }
    },
    warnings: [
      'Natural variation in potency',
      'Nausea common on onset',
      'Psychological preparation important',
      'Legal status varies by location'
    ]
  },

  // DISSOCIATIVES
  {
    id: 'ketamine',
    name: 'Ketamine',
    aliases: ['Special K', 'K', 'Ket'],
    category: 'dissociative',
    description: 'An NMDA receptor antagonist used as an anesthetic and recently approved for treatment-resistant depression.',
    color: '#00CED1',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.9,
        description: 'NMDA receptor antagonist causing dissociative effects'
      },
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.3,
        description: 'Weak opioid receptor agonism'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 50,
        light: 75,
        common: 150,
        strong: 250,
        heavy: 400
      },
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 10,
        light: 25,
        common: 50,
        strong: 100,
        heavy: 150
      }
    ],
    pharmacokinetics: {
      onset: { min: 10, max: 30 },
      peak: { min: 30, max: 60 },
      duration: { min: 1, max: 3 },
      halfLife: { min: 2, max: 4 }
    },
    warnings: [
      'Risk of bladder damage with chronic use',
      'Impaired motor function and judgment',
      'Potential for psychological dependence',
      'Medical supervision recommended for therapeutic use'
    ]
  },
  {
    id: 'dxm',
    name: 'DXM',
    aliases: ['Dextromethorphan', 'Robitussin', 'Delsym'],
    category: 'dissociative',
    description: 'A cough suppressant that acts as an NMDA receptor antagonist at higher doses.',
    color: '#9932CC',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.7,
        description: 'NMDA receptor antagonist'
      },
      {
        target: 'SERT',
        type: 'inhibition',
        affinity: 0.4,
        description: 'Serotonin reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 100,
        light: 200,
        common: 400,
        strong: 600,
        heavy: 900
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 90 },
      peak: { min: 120, max: 240 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 3, max: 6 }
    },
    warnings: [
      'Avoid products with other active ingredients',
      'Risk of serotonin syndrome with SSRIs',
      'Nausea and vomiting common',
      'Not recommended for regular use'
    ]
  },
  {
    id: 'pcp',
    name: 'PCP',
    aliases: ['Angel dust', 'Phencyclidine', 'Sherman'],
    category: 'dissociative',
    description: 'A potent NMDA receptor antagonist with strong dissociative and stimulant properties.',
    color: '#DC143C',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.95,
        description: 'Potent NMDA receptor antagonist'
      },
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.6,
        description: 'Dopamine reuptake inhibition'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 2,
        light: 5,
        common: 10,
        strong: 15,
        heavy: 25
      },
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 1,
        light: 3,
        common: 7,
        strong: 12,
        heavy: 20
      }
    ],
    pharmacokinetics: {
      onset: { min: 15, max: 45 },
      peak: { min: 60, max: 180 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 7, max: 46 }
    },
    warnings: [
      'Extremely dangerous and unpredictable',
      'High risk of violent behavior',
      'Severe psychological effects',
      'Illegal in most jurisdictions'
    ]
  },
  {
    id: 'nitrous-oxide',
    name: 'Nitrous Oxide',
    aliases: ['Laughing gas', 'N2O', 'Whippits'],
    category: 'dissociative',
    description: 'A short-acting dissociative anesthetic gas used medically and recreationally.',
    color: '#87CEEB',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.6,
        description: 'NMDA receptor antagonist'
      },
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.5,
        description: 'GABA-A receptor positive modulation'
      }
    ],
    dosageRanges: [
      {
        route: 'nasal',
        unit: 'ml',
        threshold: 500,
        light: 1000,
        common: 2000,
        strong: 4000,
        heavy: 8000
      }
    ],
    pharmacokinetics: {
      onset: { min: 0.5, max: 2 },
      peak: { min: 1, max: 3 },
      duration: { min: 2, max: 5 },
      halfLife: { min: 0.5, max: 1 }
    },
    warnings: [
      'Risk of B12 depletion with frequent use',
      'Asphyxiation risk if used improperly',
      'Never use while standing or driving',
      'Medical grade preferred over industrial'
    ]
  },

  // OTHER SUBSTANCES
  {
    id: 'cannabis',
    name: 'Cannabis',
    aliases: ['Marijuana', 'THC', 'Weed', 'Pot'],
    category: 'other',
    description: 'A plant containing cannabinoids that interact with the endocannabinoid system, producing varied effects.',
    color: '#228B22',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.8,
        description: 'CB1 and CB2 cannabinoid receptor agonist'
      },
      {
        target: 'DAT',
        type: 'release',
        affinity: 0.2,
        description: 'Indirect dopamine release in reward pathways'
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
        heavy: 50
      },
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 1,
        light: 2.5,
        common: 5,
        strong: 10,
        heavy: 20
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 120 },
      peak: { min: 60, max: 180 },
      duration: { min: 2, max: 8 },
      halfLife: { min: 12, max: 36 }
    },
    warnings: [
      'May impair memory and coordination',
      'Potential for psychological dependence',
      'Legal status varies by jurisdiction',
      'Effects vary greatly between individuals'
    ]
  },
  {
    id: 'cbd',
    name: 'CBD',
    aliases: ['Cannabidiol', 'Hemp extract'],
    category: 'other',
    description: 'A non-psychoactive cannabinoid with potential therapeutic effects, often used for anxiety and inflammation.',
    color: '#32CD32',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.4,
        description: 'CB1 receptor negative allosteric modulator'
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
        threshold: 5,
        light: 10,
        common: 25,
        strong: 50,
        heavy: 100
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 90 },
      peak: { min: 90, max: 180 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 18, max: 32 }
    },
    warnings: [
      'May interact with certain medications',
      'Quality varies between products',
      'Limited regulation in many areas',
      'Generally well-tolerated'
    ]
  },
  {
    id: 'kratom',
    name: 'Kratom',
    aliases: ['Mitragyna speciosa', 'Biak', 'Kakuam'],
    category: 'other',
    description: 'A tropical plant with leaves containing compounds that can have stimulant or opioid-like effects depending on dose.',
    color: '#8FBC8F',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.6,
        description: 'Mu-opioid receptor partial agonist'
      },
      {
        target: 'DAT',
        type: 'inhibition',
        affinity: 0.4,
        description: 'Dopamine reuptake inhibition at low doses'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 500,
        light: 1000,
        common: 2500,
        strong: 5000,
        heavy: 8000
      }
    ],
    pharmacokinetics: {
      onset: { min: 15, max: 45 },
      peak: { min: 60, max: 120 },
      duration: { min: 2, max: 6 },
      halfLife: { min: 3, max: 9 }
    },
    warnings: [
      'Potential for physical dependence',
      'Variable potency between batches',
      'Legal status varies by location',
      'May cause nausea at higher doses'
    ]
  },
  {
    id: 'melatonin',
    name: 'Melatonin',
    aliases: ['Sleep hormone', 'N-acetyl-5-methoxytryptamine'],
    category: 'other',
    description: 'A naturally occurring hormone that regulates sleep-wake cycles, commonly used as a sleep aid.',
    color: '#483D8B',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.9,
        description: 'Melatonin receptor (MT1/MT2) agonist'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 0.25,
        light: 0.5,
        common: 1,
        strong: 3,
        heavy: 10
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 60 },
      peak: { min: 60, max: 120 },
      duration: { min: 6, max: 8 },
      halfLife: { min: 0.5, max: 1 }
    },
    warnings: [
      'May cause daytime drowsiness',
      'Can affect circadian rhythms',
      'Quality varies between supplements',
      'Generally safe for short-term use'
    ]
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    aliases: ['Theanine', 'Green tea extract'],
    category: 'other',
    description: 'An amino acid found in tea leaves that promotes relaxation and may reduce anxiety without sedation.',
    color: '#6B8E23',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.5,
        description: 'GABA receptor modulation'
      },
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.3,
        description: 'Glutamate receptor antagonism'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 50,
        light: 100,
        common: 200,
        strong: 400,
        heavy: 600
      }
    ],
    pharmacokinetics: {
      onset: { min: 30, max: 60 },
      peak: { min: 60, max: 120 },
      duration: { min: 4, max: 8 },
      halfLife: { min: 1, max: 3 }
    },
    warnings: [
      'Very mild effects',
      'Generally well-tolerated',
      'May potentiate caffeine effects',
      'Rare reports of liver issues with extracts'
    ]
  },
  {
    id: 'phenibut',
    name: 'Phenibut',
    aliases: ['β-phenyl-GABA', 'Phenylethylaminobutyric acid'],
    category: 'other',
    description: 'A GABA analogue that crosses the blood-brain barrier, used for anxiety and sleep in some countries.',
    color: '#9370DB',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.7,
        description: 'GABA-B receptor agonist'
      },
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.4,
        description: 'Voltage-dependent calcium channel blocker'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 250,
        light: 500,
        common: 750,
        strong: 1500,
        heavy: 2500
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 180 },
      peak: { min: 240, max: 360 },
      duration: { min: 12, max: 24 },
      halfLife: { min: 5, max: 8 }
    },
    warnings: [
      'High potential for physical dependence',
      'Dangerous withdrawal syndrome',
      'Long onset time leads to redosing risk',
      'Not regulated as supplement in many countries'
    ]
  },
  {
    id: 'dmt',
    name: 'DMT',
    aliases: ['N,N-Dimethyltryptamine', 'Spirit molecule'],
    category: 'other',
    description: 'A powerful, short-acting psychedelic compound that occurs naturally in many plants and animals.',
    color: '#FF6347',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.95,
        description: '5-HT2A receptor agonist'
      },
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.8,
        description: 'Multiple serotonin receptor subtypes'
      }
    ],
    dosageRanges: [
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 5,
        light: 15,
        common: 30,
        strong: 50,
        heavy: 75
      }
    ],
    pharmacokinetics: {
      onset: { min: 1, max: 5 },
      peak: { min: 5, max: 15 },
      duration: { min: 15, max: 45 },
      halfLife: { min: 0.25, max: 1 }
    },
    warnings: [
      'Extremely intense and overwhelming',
      'Complete loss of contact with reality',
      'Requires experienced supervision',
      'Illegal in most jurisdictions'
    ]
  },
  {
    id: 'salvia',
    name: 'Salvia Divinorum',
    aliases: ['Salvia', 'Diviner\'s sage', 'Ska Pastora'],
    category: 'other',
    description: 'A plant containing salvinorin A, a unique kappa-opioid receptor agonist causing intense but brief dissociative effects.',
    color: '#9ACD32',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.9,
        description: 'Selective kappa-opioid receptor agonist'
      }
    ],
    dosageRanges: [
      {
        route: 'nasal',
        unit: 'mg',
        threshold: 0.25,
        light: 0.5,
        common: 1,
        strong: 2,
        heavy: 5
      }
    ],
    pharmacokinetics: {
      onset: { min: 0.5, max: 2 },
      peak: { min: 2, max: 5 },
      duration: { min: 5, max: 30 },
      halfLife: { min: 0.5, max: 1.5 }
    },
    warnings: [
      'Extremely disorienting effects',
      'Risk of physical injury during experience',
      'Unique and often unpleasant',
      'Legal status varies by location'
    ]
  },

  // MOOD STABILIZERS
  {
    id: 'lithium',
    name: 'Lithium',
    aliases: ['Lithobid', 'Eskalith', 'Lithonate'],
    category: 'mood-stabilizer',
    description: 'A mood stabilizer used primarily for bipolar disorder, affecting neurotransmitter systems and neuroprotection.',
    color: '#059669',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.6,
        description: 'Modulates serotonin and dopamine neurotransmission'
      },
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.7,
        description: 'Inhibits GSK-3β and inositol phosphatase'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 150,
        light: 300,
        common: 600,
        strong: 900,
        heavy: 1200
      }
    ],
    pharmacokinetics: {
      onset: { min: 360, max: 720 },
      peak: { min: 720, max: 1440 },
      duration: { min: 12, max: 24 },
      halfLife: { min: 18, max: 24 }
    },
    warnings: [
      'Requires regular blood level monitoring',
      'Narrow therapeutic window',
      'Kidney and thyroid function monitoring required',
      'Dehydration and sodium depletion increase toxicity risk'
    ]
  },
  {
    id: 'lamotrigine',
    name: 'Lamotrigine',
    aliases: ['Lamictal', 'Lamictal XR'],
    category: 'mood-stabilizer',
    description: 'An anticonvulsant used as a mood stabilizer, particularly effective for bipolar depression.',
    color: '#10B981',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.8,
        description: 'Voltage-gated sodium channel blocker'
      },
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.5,
        description: 'Reduces glutamate release'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 12.5,
        light: 25,
        common: 100,
        strong: 200,
        heavy: 400
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 240 },
      peak: { min: 180, max: 300 },
      duration: { min: 12, max: 24 },
      halfLife: { min: 24, max: 36 }
    },
    warnings: [
      'Risk of serious skin rashes (Stevens-Johnson syndrome)',
      'Slow titration required',
      'Drug interactions affect metabolism',
      'Monitor for mood changes during initiation'
    ]
  },
  {
    id: 'valproate',
    name: 'Valproate',
    aliases: ['Depakote', 'Depakene', 'Divalproex'],
    category: 'mood-stabilizer',
    description: 'A broad-spectrum mood stabilizer and anticonvulsant effective for mania and mixed episodes.',
    color: '#047857',
    mechanisms: [
      {
        target: 'receptor',
        type: 'agonist',
        affinity: 0.7,
        description: 'Enhances GABA neurotransmission'
      },
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.6,
        description: 'Blocks voltage-gated sodium channels'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 125,
        light: 250,
        common: 750,
        strong: 1500,
        heavy: 2500
      }
    ],
    pharmacokinetics: {
      onset: { min: 180, max: 360 },
      peak: { min: 240, max: 480 },
      duration: { min: 8, max: 16 },
      halfLife: { min: 8, max: 20 }
    },
    warnings: [
      'Liver function monitoring required',
      'Teratogenic - contraindicated in pregnancy',
      'Weight gain and hair loss possible',
      'Blood count monitoring needed'
    ]
  },
  {
    id: 'carbamazepine',
    name: 'Carbamazepine',
    aliases: ['Tegretol', 'Carbatrol', 'Epitol'],
    category: 'mood-stabilizer',
    description: 'An anticonvulsant mood stabilizer particularly effective for mixed episodes and rapid cycling.',
    color: '#065F46',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.8,
        description: 'Voltage-gated sodium channel blocker'
      },
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.4,
        description: 'Modulates adenosine and calcium channels'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 100,
        light: 200,
        common: 600,
        strong: 1000,
        heavy: 1600
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 240 },
      peak: { min: 240, max: 480 },
      duration: { min: 8, max: 12 },
      halfLife: { min: 12, max: 36 }
    },
    warnings: [
      'Risk of serious blood disorders',
      'Regular blood count monitoring required',
      'Many drug interactions via CYP3A4',
      'Skin rash monitoring needed'
    ]
  },

  // BLOOD PRESSURE MEDICATIONS
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    aliases: ['Prinivil', 'Zestril'],
    category: 'antihypertensive',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure by blocking angiotensin conversion.',
    color: '#DC2626',
    mechanisms: [
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.9,
        description: 'ACE (Angiotensin Converting Enzyme) inhibition'
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
      onset: { min: 60, max: 120 },
      peak: { min: 360, max: 420 },
      duration: { min: 24, max: 30 },
      halfLife: { min: 12, max: 13 }
    },
    warnings: [
      'Monitor kidney function and potassium levels',
      'Dry cough in some patients',
      'Angioedema risk (rare but serious)',
      'Avoid in pregnancy'
    ]
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    aliases: ['Norvasc', 'Katerzia'],
    category: 'antihypertensive',
    description: 'A calcium channel blocker that relaxes blood vessels and reduces blood pressure.',
    color: '#B91C1C',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.9,
        description: 'L-type calcium channel blocker'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 1.25,
        light: 2.5,
        common: 5,
        strong: 7.5,
        heavy: 10
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 240 },
      peak: { min: 360, max: 720 },
      duration: { min: 24, max: 48 },
      halfLife: { min: 30, max: 50 }
    },
    warnings: [
      'Ankle swelling common side effect',
      'Grapefruit juice interaction',
      'Gradual dose reduction when discontinuing',
      'Monitor for hypotension'
    ]
  },
  {
    id: 'metoprolol',
    name: 'Metoprolol',
    aliases: ['Lopressor', 'Toprol-XL'],
    category: 'antihypertensive',
    description: 'A selective beta-1 blocker used for hypertension, angina, and heart failure.',
    color: '#991B1B',
    mechanisms: [
      {
        target: 'receptor',
        type: 'antagonist',
        affinity: 0.9,
        description: 'Selective beta-1 adrenergic receptor blocker'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 12.5,
        light: 25,
        common: 50,
        strong: 100,
        heavy: 200
      }
    ],
    pharmacokinetics: {
      onset: { min: 60, max: 120 },
      peak: { min: 90, max: 180 },
      duration: { min: 6, max: 12 },
      halfLife: { min: 3, max: 7 }
    },
    warnings: [
      'Do not stop abruptly - rebound hypertension risk',
      'May mask hypoglycemia symptoms',
      'Use caution in asthma/COPD',
      'Monitor heart rate and blood pressure'
    ]
  },
  {
    id: 'hydrochlorothiazide',
    name: 'Hydrochlorothiazide',
    aliases: ['HCTZ', 'Microzide'],
    category: 'antihypertensive',
    description: 'A thiazide diuretic that reduces blood pressure by increasing sodium and water excretion.',
    color: '#7F1D1D',
    mechanisms: [
      {
        target: 'receptor',
        type: 'inhibition',
        affinity: 0.8,
        description: 'Sodium-chloride co-transporter inhibition in kidneys'
      }
    ],
    dosageRanges: [
      {
        route: 'oral',
        unit: 'mg',
        threshold: 6.25,
        light: 12.5,
        common: 25,
        strong: 37.5,
        heavy: 50
      }
    ],
    pharmacokinetics: {
      onset: { min: 120, max: 240 },
      peak: { min: 240, max: 360 },
      duration: { min: 12, max: 24 },
      halfLife: { min: 5, max: 15 }
    },
    warnings: [
      'Monitor electrolytes (potassium, sodium, magnesium)',
      'May worsen diabetes and gout',
      'Dehydration risk in hot weather',
      'Photosensitivity possible'
    ]
  }
];