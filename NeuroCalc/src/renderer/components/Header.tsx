import React from 'react';
import styled from 'styled-components';
import { SearchBar } from './SearchBar';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.sm};
  gap: 24px;
`;

const SearchSection = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]}, ${props => props.theme.colors.secondary[500]});
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const AppSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Version = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  background: ${props => props.theme.colors.background.tertiary};
  padding: 2px 8px;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>N</LogoIcon>
        <div>
          <AppTitle>NeuroCalc</AppTitle>
          <AppSubtitle>Neurotransmitter Calculator</AppSubtitle>
        </div>
      </Logo>
      
      <SearchSection>
        <SearchBar />
      </SearchSection>
      
      <InfoSection>
        <Version>v1.0.0</Version>
      </InfoSection>
    </HeaderContainer>
  );
};

export default Header;