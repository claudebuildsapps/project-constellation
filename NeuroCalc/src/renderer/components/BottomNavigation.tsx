import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { NavigationView } from '../types';

const BottomNavContainer = styled.nav`
  height: 60px;
  background: ${props => props.theme.colors.background.secondary};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
  
  /* Subtle gradient to indicate it's a navigation bar */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${props => props.theme.colors.primary[200]} 50%,
      transparent 100%
    );
  }
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
`;

const NavItem = styled.li.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive: boolean }>`
  margin: 0;
`;

const NavButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.isActive 
    ? props.theme.colors.primary[100] 
    : 'transparent'};
  color: ${props => props.isActive 
    ? props.theme.colors.primary[700] 
    : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.isActive 
    ? props.theme.typography.fontWeight.medium 
    : props.theme.typography.fontWeight.normal};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  min-width: 80px;
  justify-content: center;

  &:hover {
    background: ${props => props.isActive 
      ? props.theme.colors.primary[100] 
      : props.theme.colors.background.tertiary};
    color: ${props => props.isActive 
      ? props.theme.colors.primary[700] 
      : props.theme.colors.text.primary};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const NavIcon = styled.span`
  font-size: 16px;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const NavLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

interface NavigationItem {
  id: NavigationView;
  label: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'explorer', label: 'Explorer', icon: '🔍' },
  { id: 'substances', label: 'Substances', icon: '💊' },
  { id: 'effects', label: 'Effects', icon: '📊' },
  { id: 'compare', label: 'Compare', icon: '⚖️' },
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const BottomNavigation: React.FC = () => {
  const { view, setView } = useAppStore();

  return (
    <BottomNavContainer>
      <NavList>
        {navigationItems.map((item) => (
          <NavItem key={item.id} isActive={view === item.id}>
            <NavButton
              isActive={view === item.id}
              onClick={() => setView(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavLabel>{item.label}</NavLabel>
            </NavButton>
          </NavItem>
        ))}
      </NavList>
    </BottomNavContainer>
  );
};

export default BottomNavigation;