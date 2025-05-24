import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import SubstanceSelector from './SubstanceSelector';
import DosageControls from './DosageControls';
import EffectDisplay from './EffectDisplay';
import ExplorerView from './ExplorerView';
import SettingsView from './SettingsView';
import AboutView from './AboutView';
import HelpSystem from './HelpSystem';
import { DosageAdjustment } from './DosageAdjustment';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 60px - 60px); /* Account for header and bottom nav height */
  min-height: 0; /* Ensures proper flex behavior */
`;

const LeftPanel = styled.div`
  width: 350px;
  min-width: 350px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  
  /* Subtle gradient to indicate scrollable content */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${props => props.theme.colors.background.secondary}
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* Ensures proper flex shrinking */
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Enhanced custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.tertiary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.medium};
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
    transition: background-color ${props => props.theme.transitions.fast};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary[400]};
    background-clip: content-box;
  }
  
  &::-webkit-scrollbar-thumb:active {
    background: ${props => props.theme.colors.primary[500]};
    background-clip: content-box;
  }
  
  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border.medium} ${props => props.theme.colors.background.tertiary};
  
  /* Add padding to prevent content from touching scrollbar */
  padding-right: 4px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;


const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text.secondary};
  
  h2 {
    margin: 0 0 16px 0;
    color: ${props => props.theme.colors.text.primary};
    font-weight: 300;
  }
  
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const Router: React.FC = () => {
  const { view, selectedSubstance } = useAppStore();

  const renderMainContent = () => {
    if (view === 'settings') {
      return <SettingsView />;
    }
    
    if (view === 'about') {
      return <AboutView />;
    }

    if (view === 'help') {
      return <HelpSystem />;
    }

    if (view === 'explorer') {
      return <ExplorerView />;
    }

    if (view === 'effects') {
      return <EffectDisplay />;
    }

    // Default view is substances
    if (selectedSubstance) {
      return <EffectDisplay />;
    } else {
      return (
        <WelcomeMessage>
          <h2>Welcome to NeuroCalc</h2>
          <p>
            Select a substance from the left panel to begin calculating 
            neurotransmitter effects. This tool helps you understand how 
            different compounds affect dopamine, serotonin, and norepinephrine 
            systems.
          </p>
        </WelcomeMessage>
      );
    }
  };

  return (
    <AppWrapper>
      <Header />
      <MainContent>
        <LeftPanel>
          <ScrollableContent>
            {view === 'substances' && (
              <>
                <SubstanceSelector />
                {selectedSubstance && (
                  <>
                    <DosageControls />
                    <DosageAdjustment />
                  </>
                )}
              </>
            )}
          </ScrollableContent>
        </LeftPanel>
        
        <RightPanel>
          <ContentArea>
            {renderMainContent()}
          </ContentArea>
        </RightPanel>
      </MainContent>
      <BottomNavigation />
    </AppWrapper>
  );
};

export default Router;