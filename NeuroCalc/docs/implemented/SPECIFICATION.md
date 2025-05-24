# NeuroCalc - Pharmaceutical Neurotransmitter Calculator
## Application Specification

### 1. Overview
NeuroCalc is an Electron-based desktop application designed to calculate and visualize the effects of various pharmaceutical and recreational substances on neurotransmitter systems. The application focuses on three primary neurotransmitters: norepinephrine, dopamine, and serotonin, specifically modeling reuptake inhibition and additional release effects.

### 2. Core Features

#### 2.1 Substance Database
- **Initial Substances**: Nicotine, Caffeine, Bupropion, Adderall
- **Expandable**: Architecture supports adding new substances
- **Properties per Substance**:
  - Name and common aliases
  - Dosage ranges (therapeutic and recreational)
  - Mechanism of action descriptions
  - Pharmacokinetic data (onset, peak, duration)

#### 2.2 Neurotransmitter Effects Modeling
- **Target Neurotransmitters**:
  - Norepinephrine (NET - Norepinephrine Transporter)
  - Dopamine (DAT - Dopamine Transporter)
  - Serotonin (SERT - Serotonin Transporter)
- **Effect Types**:
  - Reuptake inhibition (IC50 values)
  - Additional release mechanisms
  - Receptor affinity effects
- **Calculation Methods**:
  - Cached pre-computed estimates
  - Real-time LLM-powered calculations
  - Dose-response curve modeling

#### 2.3 User Interface Design
- **Design Philosophy**: Clean, modern, pastel color scheme
- **Layout**: Fluid, responsive design with smooth animations
- **Components**:
  - Substance selection interface (cards/tiles)
  - Dosage input with visual sliders and numeric input
  - Real-time effect visualization (graphs/charts)
  - Results dashboard with neurotransmitter activity indicators

### 3. Technical Architecture

#### 3.1 Technology Stack
- **Framework**: Electron (cross-platform desktop)
- **Frontend**: React with TypeScript
- **Styling**: Styled-components or CSS-in-JS
- **State Management**: Redux Toolkit or Zustand
- **Charting**: Chart.js or D3.js for visualizations
- **LLM Integration**: Configurable API endpoints

#### 3.2 Data Architecture
- **Local Database**: SQLite for substance data and user preferences
- **Cache System**: Pre-computed effects for common dosages
- **LLM Interface**: Modular API system for external calculations

#### 3.3 Security Considerations
- **Data Privacy**: No personal health data storage

### 4. User Experience Flow

#### 4.1 Main Workflow
1. **Substance Selection**: Choose from available substances
2. **Dosage Configuration**: Set dosage amount and route
3. **Effect Preview**: View cached/estimated effects
4. **Detailed Calculation**: Trigger LLM-powered analysis
5. **Results Visualization**: Interactive charts and summaries

#### 4.2 Configuration Workflow
1. **LLM Settings**: Configure API endpoints and models
2. **Preferences**: Adjust display units and visualization options

### 5. Data Models

#### 5.1 Substance Model
```typescript
interface Substance {
  id: string;
  name: string;
  aliases: string[];
  category: 'stimulant' | 'depressant' | 'medication' | 'other';
  mechanisms: MechanismOfAction[];
  dosageRanges: DosageRange[];
  pharmacokinetics: PharmacokineticData;
}
```

#### 5.2 Effect Model
```typescript
interface NeurotransmitterEffect {
  substance: string;
  dosage: number;
  norepinephrine: {
    reuptakeInhibition: number; // % inhibition
    additionalRelease: number;  // % increase
  };
  dopamine: {
    reuptakeInhibition: number;
    additionalRelease: number;
  };
  serotonin: {
    reuptakeInhibition: number;
    additionalRelease: number;
  };
  confidence: number; // 0-1 calculation confidence
}
```

### 6. Visualization Components

#### 6.1 Neurotransmitter Activity Dashboard
- **Real-time Bars**: Animated bars showing current activity levels
- **Timeline View**: Effects over time (onset, peak, duration)
- **Comparison Mode**: Side-by-side substance comparisons

#### 6.2 Dose-Response Curves
- **Interactive Graphs**: Zoom and pan capabilities
- **Multiple Substances**: Overlay comparisons
- **Safety Zones**: Visual indicators for therapeutic ranges

### 7. LLM Integration Specifications

#### 7.1 Calculation Engine
- **Input Format**: Structured substance and dosage data
- **Output Format**: Standardized effect predictions
- **Model Types**: Support for multiple LLM providers
- **Fallback System**: Cached data when LLM unavailable

#### 7.2 Configuration Interface
- **API Settings**: Endpoint, authentication, model selection
- **Prompt Templates**: Customizable calculation prompts
- **Response Parsing**: Flexible output interpretation

### 8. Data Accuracy
- Clear indication of calculation confidence levels
- Sources for pharmacological data
- Regular updates to substance databases

### 9. Future Enhancements

#### 9.1 Advanced Features
- Tolerance modeling
- Personalized pharmacokinetics
- Research paper integration

#### 9.2 Platform Extensions
- Web version for broader access
- Mobile companion app
- Research data export capabilities

### 10. Performance Requirements

#### 10.1 Response Times
- Cached calculations: < 100ms
- LLM calculations: < 5 seconds
- UI interactions: < 50ms

#### 10.2 Resource Usage
- Memory: < 200MB base usage
- Storage: < 50MB for substance database
- Network: Minimal except for LLM calls

This specification provides the foundation for building a comprehensive, user-friendly pharmaceutical neurotransmitter calculator that balances functionality with safety and educational value.