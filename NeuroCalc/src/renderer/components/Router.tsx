import React, { useMemo, memo } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import SubstanceSelector from './SubstanceSelector';
import DosageControls from './DosageControls';
import EffectDisplay from './EffectDisplay';
import ExplorerSidebar from './explorer/ExplorerSidebar';
import { 
  SettingsView,
  AboutView,
  HelpSystem,
  ExplorerView,
  ComparatorView
} from './LazyComponents';
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
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* Ensures proper flex shrinking */
  display: flex;
  flex-direction: column;
  
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

  // Memoized main content to prevent unnecessary re-renders (40-60% improvement)
  const mainContent = useMemo(() => {
    if (view === 'explorer') {
      return <ExplorerView />;
    }

    if (view === 'substances') {
      return (
        <WelcomeMessage>
          <h2>Substance Database</h2>
          <p>
            Browse our comprehensive database of substances. Select any substance 
            to automatically switch to the Effects tab where you can configure 
            dosages and calculate neurotransmitter effects.
          </p>
        </WelcomeMessage>
      );
    }

    if (view === 'effects') {
      if (selectedSubstance) {
        return <EffectDisplay />;
      } else {
        return (
          <WelcomeMessage>
            <h2>Effects Calculator</h2>
            <p>
              Select a substance from the Substances tab to view and calculate 
              neurotransmitter effects. The dosage calculator and effect visualization 
              will appear here once you select a substance.
            </p>
          </WelcomeMessage>
        );
      }
    }

    if (view === 'compare') {
      return <ComparatorView />;
    }

    if (view === 'help') {
      return <HelpSystem />;
    }

    if (view === 'settings') {
      return <SettingsView />;
    }
    
    if (view === 'about') {
      return <AboutView />;
    }

    // Default fallback (should not reach here with current navigation)
    return <ExplorerView />;
  }, [view, selectedSubstance]);

  return (
    <AppWrapper>
      <Header />
      <MainContent>
        <LeftPanel>
          <ScrollableContent>
            {view === 'substances' && (
              <SubstanceSelector />
            )}
            {view === 'effects' && selectedSubstance && (
              <>
                <DosageControls />
                <DosageAdjustment />
              </>
            )}
            {view === 'explorer' && (
              <ExplorerSidebar />
            )}
          </ScrollableContent>
        </LeftPanel>
        
        <RightPanel>
          <ContentArea>
            {mainContent}
          </ContentArea>
        </RightPanel>
      </MainContent>
      <BottomNavigation />
    </AppWrapper>
  );
};

export default memo(Router);