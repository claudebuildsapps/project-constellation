import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import Router from './components/Router';
import { ContextualHelp } from './components/ContextualHelp';
import { performanceMonitor } from './utils/performanceMonitor';

const AppContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
`;

const App: React.FC = () => {
  // Performance monitoring setup with proper cleanup
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Generate performance report every 30 seconds in development
      const reportInterval = setInterval(() => {
        performanceMonitor.generateReport();
      }, 30000);

      // Cleanup on unmount - prevents memory leaks
      return () => {
        clearInterval(reportInterval);
        performanceMonitor.cleanup();
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Router />
        <ContextualHelp />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;