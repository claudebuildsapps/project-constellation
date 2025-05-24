import React, { useState } from 'react';
import styled from 'styled-components';
import { useSettingsStore } from '../store/useSettingsStore';

const DisclaimerModal = styled.div.withConfig({
  shouldForwardProp: (prop) => !['visible'].includes(prop),
})<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const DisclaimerContent = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const DisclaimerHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const CriticalIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.status.error};
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.status.error};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const DisclaimerSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.status.error};
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const WarningList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
  
  li {
    margin: 8px 0;
    line-height: 1.5;
    color: ${props => props.theme.colors.text.primary};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
  
  li strong {
    color: ${props => props.theme.colors.status.error};
  }
`;

const EmergencySection = styled.div`
  background: ${props => props.theme.colors.status.error};
  color: white;
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 24px 0;
  text-align: center;
`;

const EmergencyTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const EmergencyInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: 1.5;
  
  .phone {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    margin: 8px 0;
  }
`;

const AcknowledgmentSection = styled.div`
  margin-top: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 16px 0;
  cursor: pointer;
  text-align: left;
`;

const Checkbox = styled.input`
  margin-top: 4px;
  transform: scale(1.2);
`;

const AcknowledgmentText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${props => props.theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary[500]};
    color: white;
    border: 1px solid ${props.theme.colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary[600]};
      border-color: ${props.theme.colors.primary[600]};
    }
  ` : `
    background: ${props.theme.colors.background.tertiary};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.medium};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.background.secondary};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompactDisclaimer = styled.div`
  background: ${props => props.theme.colors.status.warning};
  color: ${props => props.theme.colors.text.primary};
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 16px 0;
  border-left: 4px solid ${props => props.theme.colors.status.error};
  
  .disclaimer-text {
    font-size: ${props => props.theme.typography.fontSize.sm};
    line-height: 1.4;
    margin-bottom: 8px;
  }
  
  .disclaimer-link {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: underline;
    cursor: pointer;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    
    &:hover {
      color: ${props => props.theme.colors.primary[700]};
    }
  }
`;

interface SafetyDisclaimerProps {
  compact?: boolean;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ compact = false }) => {
  const { settings, updateSettings } = useSettingsStore();
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(!settings.hasAcknowledgedDisclaimer);
  const [acknowledgedEducational, setAcknowledgedEducational] = useState(false);
  const [acknowledgedConsult, setAcknowledgedConsult] = useState(false);
  const [acknowledgedRisks, setAcknowledgedRisks] = useState(false);

  const canProceed = acknowledgedEducational && acknowledgedConsult && acknowledgedRisks;

  const handleAcceptDisclaimer = () => {
    if (canProceed) {
      updateSettings({ hasAcknowledgedDisclaimer: true });
      setShowFullDisclaimer(false);
    }
  };

  const handleShowFullDisclaimer = () => {
    setShowFullDisclaimer(true);
  };

  if (compact && settings.hasAcknowledgedDisclaimer && settings.showSafetyWarnings) {
    return (
      <CompactDisclaimer>
        <div className="disclaimer-text">
          <strong>⚠️ Educational Tool Only:</strong> This calculator is for research and educational purposes. 
          Always consult healthcare professionals before making any medical decisions.
        </div>
        <span className="disclaimer-link" onClick={handleShowFullDisclaimer}>
          View Full Safety Information
        </span>
      </CompactDisclaimer>
    );
  }

  if (!showFullDisclaimer) {
    return null;
  }

  return (
    <DisclaimerModal visible={showFullDisclaimer}>
      <DisclaimerContent>
        <DisclaimerHeader>
          <CriticalIcon>⚠️</CriticalIcon>
          <Title>CRITICAL SAFETY DISCLAIMER</Title>
          <Subtitle>Please Read Carefully Before Proceeding</Subtitle>
        </DisclaimerHeader>

        <DisclaimerSection>
          <SectionTitle>🎓 Educational Purpose Only</SectionTitle>
          <WarningList>
            <li><strong>This tool is designed exclusively for educational and research purposes</strong></li>
            <li>It is NOT intended for clinical decision-making or medical treatment planning</li>
            <li>All calculations are theoretical models and may not reflect individual responses</li>
            <li>Real-world pharmacokinetics vary significantly between individuals</li>
          </WarningList>
        </DisclaimerSection>

        <DisclaimerSection>
          <SectionTitle>🩺 Medical Consultation Required</SectionTitle>
          <WarningList>
            <li><strong>Always consult qualified healthcare professionals</strong> before making any decisions about medications or substances</li>
            <li>Your doctor, pharmacist, or medical team should guide all medical decisions</li>
            <li>Individual factors (genetics, health conditions, other medications) dramatically affect substance effects</li>
            <li>Never rely solely on this calculator for dosing decisions</li>
          </WarningList>
        </DisclaimerSection>

        <DisclaimerSection>
          <SectionTitle>⚠️ Serious Health Risks</SectionTitle>
          <WarningList>
            <li><strong>Improper substance use can cause serious harm or death</strong></li>
            <li>Overdosing, dangerous interactions, and adverse reactions are possible</li>
            <li>Some substances are illegal and carry legal consequences</li>
            <li>Mental health impacts and addiction potential vary by substance and individual</li>
            <li>Pregnancy, medical conditions, and other medications create additional risks</li>
          </WarningList>
        </DisclaimerSection>

        <EmergencySection>
          <EmergencyTitle>🚨 EMERGENCY INFORMATION</EmergencyTitle>
          <EmergencyInfo>
            <div>If you experience severe symptoms or suspect an overdose:</div>
            <div className="phone">CALL 911 IMMEDIATELY</div>
            <div>Poison Control: 1-800-222-1222</div>
            <div>Crisis Text Line: Text HOME to 741741</div>
          </EmergencyInfo>
        </EmergencySection>

        <DisclaimerSection>
          <SectionTitle>📊 Data Sources & Limitations</SectionTitle>
          <WarningList>
            <li>Data compiled from published research and pharmaceutical sources</li>
            <li>Models are simplified approximations of complex biological processes</li>
            <li>Individual responses may vary significantly from calculated predictions</li>
            <li>Regular updates attempt to maintain accuracy, but data may become outdated</li>
          </WarningList>
        </DisclaimerSection>

        <AcknowledgmentSection>
          <SectionTitle>Required Acknowledgments</SectionTitle>
          
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={acknowledgedEducational}
              onChange={(e) => setAcknowledgedEducational(e.target.checked)}
            />
            <AcknowledgmentText>
              I understand this tool is for educational purposes only and is not intended for medical decision-making.
            </AcknowledgmentText>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={acknowledgedConsult}
              onChange={(e) => setAcknowledgedConsult(e.target.checked)}
            />
            <AcknowledgmentText>
              I will consult qualified healthcare professionals before making any medical decisions and will not rely solely on this calculator.
            </AcknowledgmentText>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={acknowledgedRisks}
              onChange={(e) => setAcknowledgedRisks(e.target.checked)}
            />
            <AcknowledgmentText>
              I understand the serious health risks associated with improper substance use and accept full responsibility for my actions.
            </AcknowledgmentText>
          </CheckboxContainer>

          <ButtonGroup>
            <Button variant="secondary" onClick={() => window.close()}>
              Exit Application
            </Button>
            <Button 
              variant="primary" 
              disabled={!canProceed}
              onClick={handleAcceptDisclaimer}
            >
              I Understand - Proceed to Calculator
            </Button>
          </ButtonGroup>
        </AcknowledgmentSection>
      </DisclaimerContent>
    </DisclaimerModal>
  );
};

export default SafetyDisclaimer;