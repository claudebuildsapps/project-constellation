import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { NavigationView } from '../types';

const NavContainer = styled.nav`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.li.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive: boolean }>`
  margin: 0;
`;

const NavButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
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
  text-align: left;

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
  flex: 1;
`;

interface NavigationItem {
  id: NavigationView;
  label: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'substances', label: 'Substances', icon: '💊' },
  { id: 'effects', label: 'Effects', icon: '📊' },
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const Navigation: React.FC = () => {
  const { view, setView } = useAppStore();

  return (
    <NavContainer>
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
    </NavContainer>
  );
};

export default Navigation;