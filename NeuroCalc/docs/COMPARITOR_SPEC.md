# Substance Comparator Specification

## Overview
The Substance Comparator provides a side-by-side comparison mechanism allowing users to analyze the neurotransmitter effects of different substances at specific dosages. This feature enables informed decision-making and educational exploration of substance interactions.

## Core Features

### 1. Dual Substance Selection
- **Primary Substance**: Left panel selection with full substance database access
- **Secondary Substance**: Right panel selection with full substance database access
- **Independent Configuration**: Each substance has its own dosage, route, and unit settings
- **Quick Swap**: One-click button to swap primary and secondary positions

### 2. Dosage Configuration
- **Individual Controls**: Separate dosage sliders/inputs for each substance
- **Route Selection**: Independent administration routes (oral, nasal, IV, sublingual)
- **Unit Conversion**: Automatic unit handling (mg, μg, ml, units)
- **Validation**: Real-time dosage range validation

### 3. Comparison Views

#### 3.1 Side-by-Side Effects Display
```
┌─────────────────┬─────────────────┐
│   Substance A   │   Substance B   │
│   100mg Oral    │   50mg Oral     │
├─────────────────┼─────────────────┤
│ Dopamine: 75%   │ Dopamine: 45%   │
│ Serotonin: 20%  │ Serotonin: 80%  │
│ Norepineph: 60% │ Norepineph: 30% │
└─────────────────┴─────────────────┘
```

#### 3.2 Overlay Visualization
- **Radar Chart**: Neurotransmitter activity comparison
- **Timeline Overlay**: Effect duration and intensity curves
- **Bar Chart**: Direct numerical comparison
- **Difference Heatmap**: Visual representation of effect deltas

### 4. Comparison Metrics

#### 4.1 Neurotransmitter Effects
- **Reuptake Inhibition %**: Comparative blocking of transporters
- **Additional Release %**: Comparative increase in neurotransmitter release
- **Net Activity Score**: Combined effect calculation
- **Duration Profile**: Onset, peak, and duration comparison

#### 4.2 Pharmacokinetic Comparison
- **Onset Time**: Time to initial effects
- **Peak Effects**: Time to maximum intensity
- **Duration**: Total effect duration
- **Half-life**: Elimination comparison

## Technical Implementation

### 4.1 Component Architecture
```
src/renderer/components/comparator/
├── ComparatorView.tsx              # Main comparison interface
├── SubstancePanel.tsx              # Individual substance configuration
├── ComparisonDisplay.tsx           # Results visualization
├── ComparisonCharts.tsx            # Chart components
├── PharmacokineticDisplay.tsx      # Pharmacokinetic comparison display
└── ComparisonControls.tsx          # Swap, reset, export controls
```

### 4.2 Data Structure
```typescript
interface SubstanceComparison {
  primary: {
    substance: Substance;
    dosage: number;
    route: string;
    unit: string;
    effects: NeurotransmitterEffect;
  };
  secondary: {
    substance: Substance;
    dosage: number;
    route: string;
    unit: string;
    effects: NeurotransmitterEffect;
  };
  comparison: {
    dopamineDelta: number;
    serotoninDelta: number;
    norepinephrineDelta: number;
    effectSimilarity: number;
    timeProfileComparison: string;
  };
}
```

### 4.3 Calculation Engine
```typescript
interface ComparisonCalculator {
  calculateDifferences(primary: NeurotransmitterEffect, secondary: NeurotransmitterEffect): ComparisonMetrics;
  calculateSimilarity(primary: NeurotransmitterEffect, secondary: NeurotransmitterEffect): number;
  generateTimelineComparison(primary: Substance, secondary: Substance): TimelineComparison;
  calculatePharmacokineticDifferences(primary: Substance, secondary: Substance): PharmacokineticComparison;
}
```

## User Interface Design

### 5.1 Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Comparator Header                    │
│                [Swap] [Reset] [Export]                  │
├──────────────────────┬──────────────────────────────────┤
│    Primary Panel     │      Secondary Panel             │
│  ┌────────────────┐  │  ┌────────────────────────────┐  │
│  │ Substance A    │  │  │ Substance B                │  │
│  │ [Selector]     │  │  │ [Selector]                 │  │
│  │ Dosage: [____] │  │  │ Dosage: [____]             │  │
│  │ Route: [____]  │  │  │ Route: [____]              │  │
│  └────────────────┘  │  └────────────────────────────┘  │
├──────────────────────┴──────────────────────────────────┤
│                  Comparison Results                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Visual Comparison              │    │
│  │         [Charts] [Tables] [Timeline]       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Navigation Integration
- **Bottom Navigation**: Add "Compare" tab with ⚖️ icon
- **Quick Access**: "Compare" button on individual substance pages
- **URL State**: Deep-linkable comparison URLs
- **History**: Save and restore previous comparisons

### 5.3 Responsive Design
- **Desktop**: Side-by-side layout with detailed charts
- **Tablet**: Stacked panels with scrollable comparison
- **Mobile**: Tabbed interface with swipeable substance panels

## Visualization Components

### 6.1 Comparison Charts

#### Radar Chart
```typescript
interface RadarChartData {
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }
  ];
  labels: ['Dopamine', 'Serotonin', 'Norepinephrine'];
}
```

#### Timeline Overlay
```typescript
interface TimelineData {
  substance: string;
  timePoints: Array<{
    time: number; // minutes
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
  }>;
}
```

#### Effect Similarity
```typescript
interface EffectSimilarity {
  overall: number; // 0-1 similarity score
  neurotransmitters: {
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
  };
  timeProfile: {
    onset: number;
    peak: number;
    duration: number;
  };
}
```

### 6.2 Interactive Features
- **Hover Details**: Precise values on chart hover
- **Zoom Controls**: Focus on specific time ranges
- **Data Points**: Click for detailed information
- **Export Options**: PNG, SVG, PDF chart export

## Educational Features

### 7.1 Mechanism Comparison
- **Target Analysis**: Compare neurotransmitter targets
- **Effect Patterns**: Identify similar and different effect patterns
- **Duration Analysis**: Compare onset, peak, and duration
- **Dosage Equivalency**: Educational dosage relationship information

### 7.2 Learning Tools
- **Side-by-side Mechanisms**: Visual mechanism comparison
- **Effect Magnitude**: Relative strength comparison
- **Timeline Visualization**: Effect progression over time
- **Educational Notes**: Pharmacological insights and explanations

## Export and Sharing

### 8.1 Export Formats
- **PDF Report**: Comprehensive comparison document
- **CSV Data**: Raw numerical data export
- **Image Export**: Chart and visualization export
- **JSON**: Machine-readable comparison data

### 8.2 Sharing Features
- **Permalink**: Shareable comparison URLs
- **Embed Code**: Widget for external sites
- **Social Sharing**: Anonymized comparison previews
- **Academic Citation**: Proper attribution format

## Implementation Phases

### Phase 1: Core Comparison (Week 1-2)
- [x] Basic dual substance selection
- [x] Simple side-by-side effects display
- [x] Basic effect comparison
- [x] Navigation integration

### Phase 2: Enhanced Visualization (Week 3)
- [x] Radar chart implementation
- [x] Timeline overlay charts
- [x] Interactive chart features
- [x] Responsive design adaptation

### Phase 3: Advanced Features (Week 4)
- [x] Effect similarity assessment
- [x] Export functionality
- [x] Permalink sharing
- [x] Data validation system

### Phase 4: Polish and Testing (Week 5)
- [x] Performance optimization
- [x] Accessibility improvements
- [x] Comprehensive testing
- [x] User feedback integration

## Success Metrics

### 8.1 Functionality
- ✅ Compare any two substances successfully
- ✅ Display accurate neurotransmitter effects
- ✅ Provide meaningful effect comparisons
- ✅ Export comparisons in multiple formats

### 8.2 User Experience
- ✅ Intuitive substance selection process
- ✅ Clear visual comparison display
- ✅ Responsive across all device sizes
- ✅ Fast loading and interaction response

### 8.3 Educational Value
- ✅ Clear neurotransmitter effect visualization
- ✅ Meaningful pharmacokinetic comparisons
- ✅ Educational content integration
- ✅ Scientific data presentation

## Technical Considerations

### 9.1 Performance
- **Calculation Caching**: Store computed comparisons
- **Lazy Loading**: Load charts only when visible
- **Debounced Updates**: Prevent excessive recalculation
- **Memory Management**: Efficient data structure usage

### 9.2 Data Accuracy
- **Source Validation**: Verified pharmacological data
- **Calculation Verification**: Mathematical model validation
- **Research Integration**: Current scientific literature
- **Regular Updates**: Database maintenance and updates

### 9.3 Accessibility
- **Screen Reader Support**: Full ARIA implementation
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Blind Support**: Alternative visual indicators
- **High Contrast**: Accessible color schemes

## Future Enhancements

### 10.1 Advanced Features
- **Multi-Substance Comparison**: Compare 3+ substances
- **Time-based Analysis**: Effects over extended periods
- **Tolerance Modeling**: Repeated use effect simulation
- **Personalization**: Individual metabolism factors

### 10.2 Integration
- **Research Tools**: Academic research features
- **API Access**: Third-party application integration
- **Mobile App**: Dedicated mobile application
- **Database Expansion**: Additional substance data

### 10.3 Community Features
- **User Reviews**: Community comparison insights
- **Discussion Forums**: Substance comparison discussions
- **Educational Content**: User-contributed learning materials
- **Research Contributions**: Crowdsourced data collection

---

**Document Version**: 1.0  
**Last Updated**: Current Session  
**Status**: ✅ Complete Specification  
**Implementation Priority**: High