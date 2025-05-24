import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const AboutTitle = styled.h1`
  margin: 0 0 32px 0;
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const Text = styled.p`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text.secondary};
`;

const WarningBox = styled.div`
  background: ${props => props.theme.colors.warning.background};
  border: 1px solid ${props => props.theme.colors.warning.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px;
  margin: 24px 0;
`;

const WarningTitle = styled.h3`
  margin: 0 0 12px 0;
  color: ${props => props.theme.colors.warning.text};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const WarningText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.warning.text};
`;

const FeatureList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${props => props.theme.colors.text.secondary};
`;

const AboutView: React.FC = () => {
  return (
    <AboutContainer>
      <AboutTitle>About NeuroCalc</AboutTitle>
      
{/* Educational disclaimer removed */}

      <Section>
        <SectionTitle>Purpose</SectionTitle>
        <Text>
          NeuroCalc is a pharmaceutical neurotransmitter calculator that helps users 
          understand how various substances affect neurotransmitter systems, specifically 
          dopamine, serotonin, and norepinephrine. The application provides detailed 
          insights into pharmacological mechanisms of action.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Features</SectionTitle>
        <FeatureList>
          <li>Interactive substance database with detailed pharmacological information</li>
          <li>Dosage calculator with safety range indicators</li>
          <li>Real-time neurotransmitter effect visualization</li>
          <li>Multiple route of administration support</li>
          <li>Detailed mechanism of action descriptions</li>
        </FeatureList>
      </Section>

      <Section>
        <SectionTitle>Data Sources</SectionTitle>
        <Text>
          The pharmacological data in this application is compiled from peer-reviewed 
          scientific literature, pharmacology textbooks, and established drug databases. 
          All calculations are estimates based on published research and should be 
          interpreted within the context of individual variation and other factors.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Technical Information</SectionTitle>
        <Text>
          NeuroCalc is built using Electron, React, and TypeScript, providing a 
          cross-platform desktop application experience. The application uses 
          local data storage and optional AI-powered calculations for enhanced 
          accuracy.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Version Information</SectionTitle>
        <Text>
          <strong>Version:</strong> 1.0.0<br />
          <strong>Build:</strong> Development<br />
          <strong>License:</strong> MIT
        </Text>
      </Section>
    </AboutContainer>
  );
};

export default AboutView;