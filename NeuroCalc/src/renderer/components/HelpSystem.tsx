import React, { useState, memo } from 'react';
import styled from 'styled-components';

const HelpContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const HelpHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

const TabContainer = styled.div`
  margin-bottom: 24px;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: 24px;
  overflow-x: auto;
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-bottom: 2px solid ${props => props.active 
    ? props.theme.colors.primary[500] 
    : 'transparent'};
  background: transparent;
  color: ${props => props.active 
    ? props.theme.colors.primary[600] 
    : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.active 
    ? props.theme.typography.fontWeight.semibold 
    : props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.theme.colors.primary[25]};
  }
`;

const HelpSection = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const HelpContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${props => props.theme.colors.text.primary};
  
  p {
    margin: 12px 0;
  }
  
  ul, ol {
    margin: 12px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 6px 0;
  }
  
  strong {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
  }
  
  code {
    background: ${props => props.theme.colors.background.tertiary};
    padding: 2px 6px;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: monospace;
    font-size: 0.9em;
  }
`;

const WarningBox = styled.div`
  background: ${props => props.theme.colors.status.warning};
  border: 1px solid ${props => props.theme.colors.status.warning};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  margin: 16px 0;
  
  .warning-title {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text.primary};
  }
  
  .warning-content {
    font-size: ${props => props.theme.typography.fontSize.sm};
    line-height: 1.5;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const FeatureCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  margin: 12px 0;
  
  .feature-title {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text.primary};
  }
  
  .feature-description {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.text.secondary};
    line-height: 1.5;
  }
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 24px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

type HelpTab = 'overview' | 'calculator' | 'safety' | 'data' | 'troubleshooting' | 'citations';

export const HelpSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HelpTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const renderOverview = () => (
    <>
      <HelpSection>
        <SectionTitle>🎯 What is NeuroCalc?</SectionTitle>
        <HelpContent>
          <p>
            NeuroCalc is an educational pharmaceutical calculator designed to help students, researchers, 
            and healthcare professionals understand neurotransmitter pharmacology and pharmacokinetics.
          </p>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>✨ Key Features</SectionTitle>
        <HelpContent>
          <FeatureCard>
            <div className="feature-title">📊 Real-time Calculations</div>
            <div className="feature-description">
              Calculate pharmacokinetic parameters, neurotransmitter effects, and dosage relationships 
              in real-time with validated mathematical models.
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <div className="feature-title">📈 Interactive Visualizations</div>
            <div className="feature-description">
              Explore dose-response curves, timeline effects, and neurotransmitter activity through 
              interactive charts and graphs.
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <div className="feature-title">🤖 AI-Enhanced Analysis</div>
            <div className="feature-description">
              Optional LLM integration provides contextual safety recommendations and educational 
              insights based on current calculations.
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <div className="feature-title">🛡️ Safety Systems</div>
            <div className="feature-description">
              Comprehensive safety warnings, risk assessments, and emergency resources are 
              integrated throughout the application.
            </div>
          </FeatureCard>
        </HelpContent>
      </HelpSection>
    </>
  );

  const renderCalculator = () => (
    <>
      <HelpSection>
        <SectionTitle>🧮 Using the Calculator</SectionTitle>
        <HelpContent>
          <p><strong>Step 1: Select a Substance</strong></p>
          <p>Choose from the available neurotransmitter-affecting substances in the database. Each substance includes:</p>
          <ul>
            <li>Pharmacokinetic parameters (half-life, bioavailability, etc.)</li>
            <li>Neurotransmitter targets and mechanisms</li>
            <li>Safety warnings and contraindications</li>
            <li>Route-specific absorption data</li>
          </ul>

          <p><strong>Step 2: Configure Dosage</strong></p>
          <p>Enter the dosage amount and select the appropriate unit (mg, μg, ml). The calculator will:</p>
          <ul>
            <li>Validate the dosage against safety thresholds</li>
            <li>Display warnings for unusual or dangerous amounts</li>
            <li>Show comparative dosage information</li>
          </ul>

          <p><strong>Step 3: Choose Administration Route</strong></p>
          <p>Select how the substance is administered:</p>
          <ul>
            <li><code>Oral</code> - Through the digestive system</li>
            <li><code>Nasal</code> - Through nasal mucosa</li>
            <li><code>IV</code> - Intravenous injection</li>
            <li><code>Sublingual</code> - Under the tongue</li>
          </ul>

          <p><strong>Step 4: View Results</strong></p>
          <p>The calculator displays:</p>
          <ul>
            <li>Predicted plasma concentration curves</li>
            <li>Neurotransmitter effect timelines</li>
            <li>Safety assessments and recommendations</li>
            <li>Comparative analysis with other doses/routes</li>
          </ul>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>📊 Understanding the Charts</SectionTitle>
        <HelpContent>
          <p><strong>Dose-Response Curve:</strong> Shows the relationship between dosage and effect intensity.</p>
          <p><strong>Timeline Visualization:</strong> Displays how effects change over time after administration.</p>
          <p><strong>Neurotransmitter Dashboard:</strong> Real-time visualization of neurotransmitter activity levels.</p>
          
          <WarningBox>
            <div className="warning-title">📈 Chart Interpretation</div>
            <div className="warning-content">
              Charts show theoretical models based on average population data. Individual responses 
              may vary significantly due to genetics, health status, tolerance, and other factors.
            </div>
          </WarningBox>
        </HelpContent>
      </HelpSection>
    </>
  );

  const renderSafety = () => (
    <>
      <HelpSection>
        <SectionTitle>🛡️ Safety Guidelines</SectionTitle>
        <HelpContent>
          <p><strong>Educational Use Only</strong></p>
          <p>This calculator is designed exclusively for:</p>
          <ul>
            <li>Academic research and study</li>
            <li>Understanding pharmacological principles</li>
            <li>Educational demonstrations and training</li>
            <li>Theoretical modeling and analysis</li>
          </ul>

          <p><strong>Never Use For:</strong></p>
          <ul>
            <li>Determining actual drug dosages</li>
            <li>Medical treatment planning</li>
            <li>Clinical decision-making</li>
            <li>Self-medication guidance</li>
          </ul>

          <WarningBox>
            <div className="warning-title">⚠️ Critical Safety Information</div>
            <div className="warning-content">
              Improper use of pharmaceutical substances can cause serious harm or death. Always 
              consult qualified healthcare professionals before making any medical decisions.
            </div>
          </WarningBox>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>🚨 Emergency Information</SectionTitle>
        <HelpContent>
          <p><strong>If you suspect an overdose or experience severe symptoms:</strong></p>
          <ul>
            <li><strong>Call 911 immediately</strong> for life-threatening emergencies</li>
            <li><strong>Poison Control: 1-800-222-1222</strong> for poisoning guidance</li>
            <li><strong>Crisis Text Line: Text HOME to 741741</strong> for mental health crises</li>
          </ul>

          <p><strong>Emergency Symptoms (Call 911):</strong></p>
          <ul>
            <li>Difficulty breathing or stopped breathing</li>
            <li>Unconsciousness or unresponsiveness</li>
            <li>Severe chest pain or heart problems</li>
            <li>Seizures or convulsions</li>
            <li>Extreme confusion or delirium</li>
          </ul>
        </HelpContent>
      </HelpSection>
    </>
  );

  const renderData = () => (
    <>
      <HelpSection>
        <SectionTitle>📚 Data Sources</SectionTitle>
        <HelpContent>
          <p>NeuroCalc uses data compiled from peer-reviewed scientific sources:</p>
          <ul>
            <li>Published pharmacokinetic studies</li>
            <li>Pharmaceutical manufacturer data</li>
            <li>Clinical trial results</li>
            <li>Academic research publications</li>
            <li>Regulatory agency databases</li>
          </ul>

          <p><strong>Data Limitations:</strong></p>
          <ul>
            <li>Models are simplified approximations of complex biological processes</li>
            <li>Individual responses vary significantly from population averages</li>
            <li>Data may become outdated as new research emerges</li>
            <li>Not all substances or routes may be fully characterized</li>
          </ul>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>🔬 Calculation Methods</SectionTitle>
        <HelpContent>
          <p><strong>Pharmacokinetic Modeling:</strong></p>
          <ul>
            <li>One- and two-compartment models</li>
            <li>First-order absorption and elimination</li>
            <li>Route-specific bioavailability factors</li>
            <li>Individual parameter variations</li>
          </ul>

          <p><strong>Neurotransmitter Effects:</strong></p>
          <ul>
            <li>Receptor binding kinetics</li>
            <li>Synaptic concentration modeling</li>
            <li>Effect-site equilibration delays</li>
            <li>Tolerance and sensitization factors</li>
          </ul>
        </HelpContent>
      </HelpSection>
    </>
  );

  const renderTroubleshooting = () => (
    <>
      <HelpSection>
        <SectionTitle>🔧 Common Issues</SectionTitle>
        <HelpContent>
          <p><strong>Calculator Not Showing Results:</strong></p>
          <ul>
            <li>Ensure a substance is selected from the dropdown</li>
            <li>Check that dosage is entered and greater than 0</li>
            <li>Verify that a valid administration route is selected</li>
            <li>Look for error messages in the safety panel</li>
          </ul>

          <p><strong>Charts Not Displaying:</strong></p>
          <ul>
            <li>Refresh the page to reload chart components</li>
            <li>Check that JavaScript is enabled in your browser</li>
            <li>Try switching between different chart types</li>
            <li>Ensure your browser supports modern web standards</li>
          </ul>

          <p><strong>LLM Integration Issues:</strong></p>
          <ul>
            <li>Check API endpoint configuration in settings</li>
            <li>Verify API key is correctly entered</li>
            <li>Ensure internet connection is stable</li>
            <li>Check API service status and rate limits</li>
          </ul>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>💻 Technical Requirements</SectionTitle>
        <HelpContent>
          <p><strong>System Requirements:</strong></p>
          <ul>
            <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>JavaScript enabled</li>
            <li>Internet connection (for LLM features)</li>
            <li>Minimum 4GB RAM recommended</li>
          </ul>

          <p><strong>Browser Compatibility:</strong></p>
          <ul>
            <li>Chrome 90+ (recommended)</li>
            <li>Firefox 88+</li>
            <li>Safari 14+</li>
            <li>Edge 90+</li>
          </ul>
        </HelpContent>
      </HelpSection>
    </>
  );

  const renderCitations = () => (
    <>
      <HelpSection>
        <SectionTitle>📖 Scientific References</SectionTitle>
        <HelpContent>
          <p>Key references used in NeuroCalc development:</p>
          
          <p><strong>Pharmacokinetics:</strong></p>
          <ul>
            <li>Rowland, M., & Tozer, T. N. (2010). Clinical Pharmacokinetics and Pharmacodynamics: Concepts and Applications</li>
            <li>Shargel, L., & Yu, A. B. (2015). Applied Biopharmaceutics & Pharmacokinetics</li>
            <li>Gabrielsson, J., & Weiner, D. (2016). Pharmacokinetic and Pharmacodynamic Data Analysis</li>
          </ul>

          <p><strong>Neuropharmacology:</strong></p>
          <ul>
            <li>Brunton, L. L., et al. (2017). Goodman & Gilman's The Pharmacological Basis of Therapeutics</li>
            <li>Meyer, J. S., & Quenzer, L. F. (2018). Psychopharmacology: Drugs, the Brain, and Behavior</li>
            <li>Stahl, S. M. (2020). Stahl's Essential Psychopharmacology: Neuroscientific Basis and Practical Applications</li>
          </ul>

          <p><strong>Safety Guidelines:</strong></p>
          <ul>
            <li>FDA Guidance for Industry documents</li>
            <li>ICH Guidelines for drug development</li>
            <li>WHO Expert Committee reports</li>
            <li>Academic institution safety protocols</li>
          </ul>
        </HelpContent>
      </HelpSection>

      <HelpSection>
        <SectionTitle>📝 Data Updates</SectionTitle>
        <HelpContent>
          <p>The NeuroCalc database is updated regularly to incorporate:</p>
          <ul>
            <li>New pharmacokinetic research findings</li>
            <li>Updated safety information and warnings</li>
            <li>Revised dosing guidelines from regulatory agencies</li>
            <li>Community feedback and error corrections</li>
          </ul>
          
          <p>Last database update: Version 1.0.0 (Current)</p>
        </HelpContent>
      </HelpSection>
    </>
  );

  const getFilteredContent = () => {
    const content = {
      overview: renderOverview(),
      calculator: renderCalculator(),
      safety: renderSafety(),
      data: renderData(),
      troubleshooting: renderTroubleshooting(),
      citations: renderCitations()
    };

    return content[activeTab];
  };

  return (
    <HelpContainer>
      <HelpHeader>
        <Title>Help & Documentation</Title>
        <Subtitle>Comprehensive guide to using NeuroCalc safely and effectively</Subtitle>
      </HelpHeader>

      <SearchBox
        type="text"
        placeholder="Search help topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TabContainer>
        <TabList>
          <Tab
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab
            active={activeTab === 'calculator'}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator Guide
          </Tab>
          <Tab
            active={activeTab === 'safety'}
            onClick={() => setActiveTab('safety')}
          >
            Safety Information
          </Tab>
          <Tab
            active={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
          >
            Data Sources
          </Tab>
          <Tab
            active={activeTab === 'troubleshooting'}
            onClick={() => setActiveTab('troubleshooting')}
          >
            Troubleshooting
          </Tab>
          <Tab
            active={activeTab === 'citations'}
            onClick={() => setActiveTab('citations')}
          >
            References
          </Tab>
        </TabList>

        {getFilteredContent()}
      </TabContainer>
    </HelpContainer>
  );
};

export default memo(HelpSystem);