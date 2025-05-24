import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import Router from './components/Router';
import { ContextualHelp } from './components/ContextualHelp';

const AppContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
`;

const App: React.FC = () => {
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