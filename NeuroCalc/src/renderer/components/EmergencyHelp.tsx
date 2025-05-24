import React, { useState } from 'react';
import styled from 'styled-components';

const EmergencyContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
`;

const EmergencyButton = styled.button<{ pulsing: boolean }>`
  background: ${props => props.theme.colors.status.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.pulsing && `
    animation: pulse 2s infinite;
  `}
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
  }
`;

const EmergencyModal = styled.div.withConfig({
  shouldForwardProp: (prop) => !['visible'].includes(prop),
})<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
`;

const EmergencyContent = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const EmergencyHeader = styled.div`
  margin-bottom: 24px;
`;

const EmergencyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.status.error};
`;

const EmergencyTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.status.error};
`;

const EmergencySubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ContactCard = styled.div`
  background: ${props => props.theme.colors.status.error};
  color: white;
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 16px 0;
`;

const ContactTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const PhoneNumber = styled.a`
  color: white;
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  display: block;
  margin: 8px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContactDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  opacity: 0.9;
  line-height: 1.4;
`;

const SupportCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  margin: 12px 0;
  text-align: left;
`;

const SupportTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const SupportContact = styled.a`
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const SupportDescription = styled.p`
  margin: 4px 0 0 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.4;
`;

const SymptomSection = styled.div`
  background: ${props => props.theme.colors.status.warning};
  color: ${props => props.theme.colors.text.primary};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 16px 0;
  text-align: left;
`;

const SymptomTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const SymptomList = styled.ul`
  margin: 8px 0;
  padding-left: 16px;
  
  li {
    margin: 4px 0;
    font-size: ${props => props.theme.typography.fontSize.sm};
    line-height: 1.4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: ${props.theme.colors.status.error};
          color: white;
          border: 1px solid ${props.theme.colors.status.error};
          
          &:hover {
            background: #dc2626;
            border-color: #dc2626;
          }
        `;
      case 'primary':
        return `
          background: ${props.theme.colors.primary[500]};
          color: white;
          border: 1px solid ${props.theme.colors.primary[500]};
          
          &:hover {
            background: ${props.theme.colors.primary[600]};
            border-color: ${props.theme.colors.primary[600]};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.background.tertiary};
          color: ${props.theme.colors.text.primary};
          border: 1px solid ${props.theme.colors.border.medium};
          
          &:hover {
            background: ${props.theme.colors.background.secondary};
          }
        `;
    }
  }}
`;

export const EmergencyHelp: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const emergencyContacts = [
    {
      title: "Emergency Services",
      phone: "911",
      description: "For life-threatening emergencies, severe overdose symptoms, or immediate medical attention"
    },
    {
      title: "Poison Control Center",
      phone: "1-800-222-1222",
      description: "24/7 expert guidance for poisoning and overdose situations"
    }
  ];

  const supportContacts = [
    {
      title: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "24/7 crisis support via text message"
    },
    {
      title: "SAMHSA National Helpline",
      contact: "1-800-662-4357",
      description: "Treatment referral and information service for substance abuse and mental health"
    },
    {
      title: "National Suicide Prevention Lifeline",
      contact: "988",
      description: "24/7 crisis support for suicidal thoughts or mental health crises"
    }
  ];

  const emergencySymptoms = [
    "Difficulty breathing or stopped breathing",
    "Unconsciousness or unresponsiveness",
    "Severe chest pain or heart problems",
    "Seizures or convulsions",
    "Severe allergic reactions",
    "Extreme confusion or delirium",
    "Dangerously high or low body temperature",
    "Uncontrollable bleeding"
  ];

  const handleCallEmergency = (phone: string) => {
    // In a real Electron app, you could integrate with the system dialer
    window.open(`tel:${phone}`);
  };

  return (
    <>
      <EmergencyContainer>
        <EmergencyButton 
          pulsing={true}
          onClick={() => setShowModal(true)}
          title="Emergency Help & Resources"
        >
          🚨
        </EmergencyButton>
      </EmergencyContainer>

      <EmergencyModal visible={showModal}>
        <EmergencyContent>
          <EmergencyHeader>
            <EmergencyIcon>🚨</EmergencyIcon>
            <EmergencyTitle>EMERGENCY RESOURCES</EmergencyTitle>
            <EmergencySubtitle>Get immediate help when you need it</EmergencySubtitle>
          </EmergencyHeader>

          <SymptomSection>
            <SymptomTitle>⚠️ Call 911 Immediately If Experiencing:</SymptomTitle>
            <SymptomList>
              {emergencySymptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </SymptomList>
          </SymptomSection>

          {emergencyContacts.map((contact, index) => (
            <ContactCard key={index}>
              <ContactTitle>{contact.title}</ContactTitle>
              <PhoneNumber 
                href={`tel:${contact.phone}`}
                onClick={() => handleCallEmergency(contact.phone)}
              >
                {contact.phone}
              </PhoneNumber>
              <ContactDescription>{contact.description}</ContactDescription>
            </ContactCard>
          ))}

          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <h4 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>Additional Support Resources</h4>
            {supportContacts.map((contact, index) => (
              <SupportCard key={index}>
                <SupportTitle>{contact.title}</SupportTitle>
                <SupportContact href={contact.contact.includes('@') ? `mailto:${contact.contact}` : `tel:${contact.contact}`}>
                  {contact.contact}
                </SupportContact>
                <SupportDescription>{contact.description}</SupportDescription>
              </SupportCard>
            ))}
          </div>

          <ButtonGroup>
            <Button variant="danger" onClick={() => handleCallEmergency('911')}>
              Call 911 Now
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </ButtonGroup>
        </EmergencyContent>
      </EmergencyModal>
    </>
  );
};

export default EmergencyHelp;