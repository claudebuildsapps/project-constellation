import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Types
interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  icon?: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface OnboardingFlowProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled Components
const OnboardingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const OnboardingModal = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease-out;
`;

const OnboardingHeader = styled.div`
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const StepDot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active', 'completed'].includes(prop),
})<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => {
    if (props.completed) {
      return `
        background: ${props.theme.colors.accent[500]};
        transform: scale(1.1);
      `;
    } else if (props.active) {
      return `
        background: ${props.theme.colors.primary[500]};
        transform: scale(1.2);
        box-shadow: 0 0 0 3px ${props.theme.colors.primary[100]};
      `;
    } else {
      return `
        background: ${props.theme.colors.border.medium};
      `;
    }
  }}
`;

const StepTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const StepSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const OnboardingContent = styled.div`
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 300px;
`;

const StepIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  animation: ${slideIn} 0.5s ease-out;
`;

const StepImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  animation: ${slideIn} 0.5s ease-out;
`;

const StepContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${slideIn} 0.5s ease-out 0.1s both;
`;

const StepDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.primary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  margin: 0 0 24px 0;
`;

const OnboardingActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  padding: 12px 24px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary[500]};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.primary[600]};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.background.tertiary};
          color: ${props.theme.colors.text.primary};
          border: 1px solid ${props.theme.colors.border.medium};
          
          &:hover {
            background: ${props.theme.colors.background.primary};
            border-color: ${props.theme.colors.border.dark};
          }
        `;
      case 'ghost':
      default:
        return `
          background: transparent;
          color: ${props.theme.colors.text.secondary};
          
          &:hover {
            color: ${props.theme.colors.text.primary};
            background: ${props.theme.colors.background.tertiary};
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const ProgressBar = styled.div`
  height: 3px;
  background: ${props => props.theme.colors.background.tertiary};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${props => props.theme.colors.primary[500]};
  width: ${props => props.progress}%;
  transition: width ${props => props.theme.transitions.normal};
`;

// Default onboarding steps for NeuroCalc
const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NeuroCalc',
    content: 'NeuroCalc helps you understand how different substances affect neurotransmitter activity in the brain.',
    icon: '🧠'
  },
  {
    id: 'substances',
    title: 'Choose a Substance',
    content: 'Start by selecting a substance from the left panel. We include detailed pharmacological data for each compound.',
    icon: '💊'
  },
  {
    id: 'dosage',
    title: 'Set Dosage Parameters',
    content: 'Use the dosage controls to specify amount, route of administration, and see real-time safety validation.',
    icon: '⚖️'
  },
  {
    id: 'effects',
    title: 'View Neurotransmitter Effects',
    content: 'Calculate and visualize how the substance affects dopamine, serotonin, and norepinephrine activity.',
    icon: '📊'
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    content: 'Explore the interface, experiment with different substances and dosages, and learn about neuropharmacology.',
    icon: '🎉'
  }
];

// Main Onboarding Component
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  steps = defaultSteps,
  onComplete,
  onSkip,
  autoStart = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(autoStart);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('neurocalc_onboarding_completed');
    if (hasCompletedOnboarding && autoStart) {
      setIsVisible(false);
    }
  }, [autoStart]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('neurocalc_onboarding_completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('neurocalc_onboarding_completed', 'true');
    setIsVisible(false);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const handleStepAction = () => {
    if (step.action) {
      step.action.handler();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <OnboardingOverlay>
      <OnboardingModal>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <OnboardingHeader>
          <StepIndicator>
            {steps.map((_, index) => (
              <StepDot
                key={index}
                active={index === currentStep}
                completed={index < currentStep}
              />
            ))}
          </StepIndicator>
          
          <StepTitle>{step.title}</StepTitle>
          <StepSubtitle>
            Step {currentStep + 1} of {steps.length}
          </StepSubtitle>
        </OnboardingHeader>

        <OnboardingContent>
          {step.icon && <StepIcon>{step.icon}</StepIcon>}
          {step.image && <StepImage src={step.image} alt={step.title} />}
          
          <StepContent>
            <StepDescription>{step.content}</StepDescription>
            
            {step.action && (
              <ActionButton variant="secondary" onClick={handleStepAction}>
                {step.action.label}
              </ActionButton>
            )}
          </StepContent>
        </OnboardingContent>

        <OnboardingActions>
          <div style={{ display: 'flex', gap: '12px' }}>
            {onSkip && (
              <ActionButton variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </ActionButton>
            )}
            {currentStep > 0 && (
              <ActionButton variant="secondary" onClick={handlePrevious}>
                ← Previous
              </ActionButton>
            )}
          </div>
          
          <ActionButton variant="primary" onClick={handleNext}>
            {isLastStep ? 'Get Started' : 'Next →'}
          </ActionButton>
        </OnboardingActions>
      </OnboardingModal>
    </OnboardingOverlay>
  );
};

// Hook for managing onboarding state
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('neurocalc_onboarding_completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('neurocalc_onboarding_completed');
    setShowOnboarding(true);
  };

  const hasCompletedOnboarding = () => {
    return localStorage.getItem('neurocalc_onboarding_completed') === 'true';
  };

  useEffect(() => {
    // Auto-show onboarding for new users
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  return {
    showOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
    hasCompletedOnboarding
  };
};

// Tutorial overlay component for highlighting specific elements
const TutorialOverlay = styled.div<{ target: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    /* Dynamic positioning based on target element */
  }
`;

const TutorialTooltip = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 24px;
  max-width: 300px;
  z-index: 1000;
  pointer-events: auto;
`;

interface TutorialStepProps {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onSkip?: () => void;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  target,
  title,
  content,
  position = 'bottom',
  onNext,
  onSkip
}) => {
  return (
    <>
      <TutorialOverlay target={target} />
      <TutorialTooltip>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
          {title}
        </h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: 1.5 }}>
          {content}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {onSkip && (
            <ActionButton variant="ghost" onClick={onSkip}>
              Skip
            </ActionButton>
          )}
          {onNext && (
            <ActionButton variant="primary" onClick={onNext}>
              Next
            </ActionButton>
          )}
        </div>
      </TutorialTooltip>
    </>
  );
};

export default OnboardingFlow;