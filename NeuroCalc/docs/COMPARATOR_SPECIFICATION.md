# Substance Comparator Specification

## Overview
The Substance Comparator provides users with side-by-side analysis of multiple substances, enabling informed decision-making through comprehensive neurotransmitter effect comparisons, safety assessments, and interaction analysis.

## Page Structure

### Layout
- **Position**: Dedicated "Compare" navigation item in bottom navigation  
- **Icon**: ⚖️ (balance scale representing comparison)
- **Layout**: Multi-panel interface with substance selection, comparison matrix, and visualization panels

### Core Functionality

#### 1. **Multi-Substance Selection**
**Features:**
- Add up to 4 substances for simultaneous comparison
- Quick-add from recently viewed substances
- Category-based substance browser integration  
- Search-powered substance addition
- Drag-and-drop substance reordering

#### 2. **Comparison Matrix**
**Features:**
- Side-by-side property comparison table
- Neurotransmitter effect comparison (NET, DAT, SERT)
- Dosage range comparison across routes
- Pharmacokinetic profile comparison (onset, peak, duration)
- Safety profile and interaction warnings
- Mechanism of action comparison

#### 3. **Visual Comparison Tools**
**Features:**
- Radar charts for neurotransmitter activity profiles  
- Side-by-side bar charts for dosage ranges
- Timeline overlays for pharmacokinetic comparisons
- Interactive dose-response curve overlays
- Safety scoring visualization

#### 4. **Interaction Analysis**
**Features:**
- Pairwise interaction detection and warnings
- Synergy/antagonism effect predictions
- Combined safety assessment
- Timing-based interaction modeling
- Contraindication highlighting

## Parallelizable Development Tasks

### **Workflow Group A: Core Infrastructure**
*Dependencies: None - Can start immediately*

- [x] **A1**: Create CompareView component structure (`CompareView.tsx`)
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **A2**: Add "compare" navigation item to BottomNavigation
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **A3**: Create comparison data types and interfaces
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **A4**: Integrate CompareView into Router component
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group B: Substance Selection Components**
*Dependencies: A1, A3 - Requires core structure*

- [x] **B1**: Create SubstanceSelector component for comparison
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **B2**: Create SubstanceCard component with add/remove functionality
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [ ] **B3**: Implement drag-and-drop substance reordering
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **B4**: Create quick-add from recent substances feature
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

### **Workflow Group C: Comparison Matrix**
*Dependencies: A3, B1-B2 - Requires substance selection*

- [x] **C1**: Create ComparisonTable component with property matrix
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **C2**: Add sortable/filterable columns to comparison table
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [ ] **C3**: Add dosage range comparison with route filtering
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **C4**: Create pharmacokinetic profile comparison section
  - **Assignee**: Agent_Phoenix
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [ ] **C5**: Implement safety profile and warnings comparison
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

### **Workflow Group D: Visual Comparison Tools**
*Dependencies: C1-C2 - Requires comparison data*

- [x] **D1**: Create RadarChart component for neurotransmitter profiles
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **D2**: Implement side-by-side bar charts for dosage ranges
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **D3**: Create pharmacokinetic timeline overlay visualization
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [ ] **D4**: Build interactive dose-response curve comparison
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **D5**: Implement safety scoring visualization component
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

### **Workflow Group E: Interaction Analysis**
*Dependencies: B1-B2, C1-C2 - Requires substance selection and comparison*

- [x] **E1**: Create interaction detection algorithm
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **E2**: Implement pairwise interaction warning system
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **E3**: Build synergy/antagonism effect calculator
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [ ] **E4**: Create combined safety assessment component
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **E5**: Implement timing-based interaction modeling
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

### **Workflow Group F: Enhanced Features**
*Dependencies: All above groups - Final polish*

- [ ] **F1**: Add export functionality for comparison results
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **F2**: Implement comparison preset saving and loading
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **F3**: Create comparison sharing functionality
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **F4**: Add AI-powered comparison insights
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

### **Workflow Group G: Testing & Documentation**
*Dependencies: A1-A4, D1-D5 - Requires working comparison system*

- [ ] **G1**: Write unit tests for comparison components
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **G2**: Create integration tests for comparison workflows
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **G3**: Perform accessibility audit for comparison interface
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **G4**: Create comparison feature documentation
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

## Technical Requirements

### Component Structure
```
src/renderer/components/
├── CompareView.tsx
├── compare/
│   ├── SubstanceSelector.tsx
│   ├── SubstanceCard.tsx
│   ├── ComparisonTable.tsx
│   ├── RadarChart.tsx
│   ├── DosageRangeChart.tsx
│   ├── PharmacokineticTimeline.tsx
│   ├── InteractionAnalysis.tsx
│   ├── SafetyAssessment.tsx
│   └── ComparisonExport.tsx
└── ...
```

### Data Structure
```typescript
interface ComparisonState {
  selectedSubstances: Substance[];
  comparisonMode: 'table' | 'visual' | 'interaction';
  activeRoute: string;
  activeDosages: Record<string, number>;
  interactions: InteractionWarning[];
  presets: ComparisonPreset[];
}

interface InteractionWarning {
  substances: [string, string];
  severity: 'info' | 'caution' | 'warning' | 'danger';
  type: 'synergy' | 'antagonism' | 'contraindication';
  description: string;
  recommendations: string[];
}

interface ComparisonPreset {
  id: string;
  name: string;
  substances: string[];
  dosages: Record<string, number>;
  route: string;
  notes?: string;
  created: Date;
}
```

### Store Integration
- Extend useAppStore with comparison state management
- Add comparison history and preset storage
- Implement comparison-specific calculations and caching

## Design Specifications

### Visual Design
- **Layout**: Three-panel design (selection, comparison, visualization)
- **Color Coding**: Consistent substance color coding across all views
- **Responsive**: Collapsible panels for mobile optimization
- **Typography**: Clear hierarchy for comparison data

### Interaction Design
- **Drag-and-Drop**: Intuitive substance reordering
- **Hover States**: Interactive comparison tooltips
- **Progressive Disclosure**: Expandable detail sections
- **Real-time Updates**: Live comparison updates as substances change

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels for all comparison data
- **Color Blind**: Alternative indicators beyond color
- **High Contrast**: Support for accessibility themes

## Success Criteria

1. ✅ Users can select and compare up to 4 substances simultaneously
2. ✅ Comparison matrix displays all critical substance properties  
3. ✅ Visual charts provide intuitive comparison insights
4. ✅ Interaction warnings alert users to dangerous combinations
5. ✅ Export functionality allows sharing comparison results
6. ✅ Interface remains responsive and accessible across devices
7. ✅ Performance remains smooth with complex comparisons

## Task Tracking System

### Checkout Process
1. Developer claims task by filling in **Assignee** field
2. Developer adds **Checkout Date** 
3. Developer updates **Status** to 🔄 In Progress
4. Upon completion, developer updates **Status** to ✅ Complete

### Status Legend
- ⬜ **Not Started**: Task available for assignment
- 🔄 **In Progress**: Developer actively working on task
- ✅ **Complete**: Task finished and tested
- ❌ **Blocked**: Task waiting on dependencies or issues

### Progress Tracking
Track overall progress by workflow group:
- **Group A**: ___/4 complete (Core Infrastructure)
- **Group B**: ___/4 complete (Substance Selection)
- **Group C**: ___/5 complete (Comparison Matrix)
- **Group D**: ___/5 complete (Visual Tools)
- **Group E**: ___/5 complete (Interaction Analysis)
- **Group F**: ___/4 complete (Enhanced Features)
- **Group G**: ___/4 complete (Testing & Documentation)

**Total Progress**: ___/31 tasks complete

## Integration Points

### Existing System Dependencies
- **Substance Database**: Leverages existing substance data structure
- **Chart.js Components**: Extends current visualization system
- **Theme System**: Uses established design tokens
- **State Management**: Integrates with current Zustand store

### External Integrations
- **LLM Services**: AI-powered comparison insights
- **Export System**: Leverages existing export infrastructure
- **Help System**: Contextual help for comparison features

## Safety Considerations

### Interaction Warning System
- **Critical Warnings**: Immediate alerts for dangerous combinations
- **Contextual Information**: Detailed interaction explanations
- **Medical Disclaimers**: Clear safety guidance and limitations
- **Emergency Information**: Quick access to harm reduction resources

### Data Accuracy
- **Source Attribution**: Clear indication of data sources
- **Confidence Levels**: Transparency about prediction accuracy
- **Update Mechanisms**: Regular data validation and updates
- **User Verification**: Encourage professional consultation

---

**Implementation Priority**: High - Substance comparison is a core safety feature that significantly enhances harm reduction capabilities by enabling informed decision-making through comprehensive substance analysis.