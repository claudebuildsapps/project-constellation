import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { Substance } from '../types';

const SelectorContainer = styled.div`
  padding: 16px;
  flex: 1;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const SubstanceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubstanceCard = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'color'].includes(prop),
})<{ isSelected: boolean; color: string }>`
  width: 100%;
  padding: 16px;
  border: 2px solid ${props => props.isSelected 
    ? props.color 
    : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.isSelected 
    ? `${props.color}15` 
    : props.theme.colors.background.secondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: ${props => props.color};
    background: ${props => `${props.color}10`};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubstanceName = styled.h4`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const SubstanceCategory = styled.span.withConfig({
  shouldForwardProp: (prop) => !['category'].includes(prop),
})<{ category: string }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => {
    switch (props.category) {
      case 'stimulant':
        return props.theme.colors.status.error;
      case 'medication':
        return props.theme.colors.primary[600];
      case 'depressant':
        return props.theme.colors.secondary[600];
      default:
        return props.theme.colors.text.tertiary;
    }
  }};
`;

const SubstanceDescription = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SubstanceAliases = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

const AliasTag = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  background: ${props => props.theme.colors.background.tertiary};
  color: ${props => props.theme.colors.text.tertiary};
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text.secondary};
`;

const SubstanceSelector: React.FC = () => {
  const { substances, selectedSubstance, setSelectedSubstance, view } = useAppStore();

  if (view !== 'substances') return null;

  if (substances.length === 0) {
    return (
      <SelectorContainer>
        <SectionTitle>Substances</SectionTitle>
        <EmptyState>
          No substances available. Check your database connection.
        </EmptyState>
      </SelectorContainer>
    );
  }

  const handleSubstanceSelect = (substance: Substance) => {
    setSelectedSubstance(substance);
  };

  return (
    <SelectorContainer>
      <SectionTitle>Available Substances</SectionTitle>
      <SubstanceGrid>
        {substances.map((substance) => (
          <SubstanceCard
            key={substance.id}
            isSelected={selectedSubstance?.id === substance.id}
            color={substance.color}
            onClick={() => handleSubstanceSelect(substance)}
            aria-pressed={selectedSubstance?.id === substance.id}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <SubstanceName>{substance.name}</SubstanceName>
              <SubstanceCategory category={substance.category}>
                {substance.category}
              </SubstanceCategory>
            </div>
            
            <SubstanceDescription>
              {substance.description}
            </SubstanceDescription>
            
            {substance.aliases.length > 0 && (
              <SubstanceAliases>
                {substance.aliases.slice(0, 3).map((alias, index) => (
                  <AliasTag key={index}>{alias}</AliasTag>
                ))}
                {substance.aliases.length > 3 && (
                  <AliasTag>+{substance.aliases.length - 3} more</AliasTag>
                )}
              </SubstanceAliases>
            )}
          </SubstanceCard>
        ))}
      </SubstanceGrid>
    </SelectorContainer>
  );
};

export default SubstanceSelector;