import React from 'react';
import styled from 'styled-components';
import { Substance } from '../../types';

interface SubstancePreviewProps {
  substance: Substance;
  categoryColor: string;
  onSelect: (substance: Substance) => void;
}

const PreviewCard = styled.div<{ categoryColor: string }>`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 16px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.categoryColor};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.categoryColor};
    opacity: 0.8;
  }
`;

const SubstanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const SubstanceName = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
`;

const SubstanceType = styled.span<{ categoryColor: string }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.categoryColor};
  background: ${props => props.categoryColor}15;
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SubstanceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubstanceCategory = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: capitalize;
`;

const SubstanceAliases = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  font-style: italic;
  max-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.fast};

  ${PreviewCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 4px 8px;
  border: 1px solid ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary[400] 
      : props.theme.colors.border.medium
  };
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary[50] 
      : 'transparent'
  };
  color: ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary[700] 
      : props.theme.colors.text.secondary
  };
  font-size: ${props => props.theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => 
      props.variant === 'primary' 
        ? props.theme.colors.primary[100] 
        : props.theme.colors.background.tertiary
    };
  }
`;

// Helper function to determine substance type based on category and name
const getSubstanceType = (substance: Substance): string => {
  const name = substance.name.toLowerCase();
  
  // Pharmaceutical indicators
  if (name.includes('adderall') || name.includes('ritalin') || name.includes('vyvanse') ||
      name.includes('xanax') || name.includes('valium') || name.includes('prozac') ||
      name.includes('zoloft') || name.includes('morphine') || name.includes('oxycodone')) {
    return 'Pharmaceutical';
  }
  
  // OTC/Supplement indicators
  if (name.includes('caffeine') || name.includes('melatonin') || name.includes('theanine') ||
      name.includes('cbd') || name.includes('kratom') || name.includes('st. john')) {
    return 'Supplement';
  }
  
  // Legal substances
  if (name.includes('alcohol') || name.includes('nicotine') || name.includes('salvia')) {
    return 'Legal';
  }
  
  // Default to recreational for others
  return 'Recreational';
};

const SubstancePreview: React.FC<SubstancePreviewProps> = ({
  substance,
  categoryColor,
  onSelect
}) => {
  const substanceType = getSubstanceType(substance);
  
  const handleSelect = () => {
    onSelect(substance);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Show substance info modal
    console.log('Show info for:', substance.name);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add to favorites
    console.log('Add to favorites:', substance.name);
  };

  return (
    <PreviewCard categoryColor={categoryColor} onClick={handleSelect}>
      <SubstanceHeader>
        <SubstanceName>{substance.name}</SubstanceName>
        <SubstanceType categoryColor={categoryColor}>
          {substanceType}
        </SubstanceType>
      </SubstanceHeader>
      
      <SubstanceDetails>
        <SubstanceCategory>
          {substance.category.replace(/([A-Z])/g, ' $1').trim()}
        </SubstanceCategory>
        
        {substance.aliases.length > 0 && (
          <SubstanceAliases>
            Also known as: {substance.aliases.slice(0, 3).join(', ')}
            {substance.aliases.length > 3 && '...'}
          </SubstanceAliases>
        )}
      </SubstanceDetails>

      <QuickActions>
        <ActionButton variant="primary" onClick={handleSelect}>
          View Effects
        </ActionButton>
        <ActionButton onClick={handleInfoClick}>
          ℹ️
        </ActionButton>
        <ActionButton onClick={handleFavoriteClick}>
          ♡
        </ActionButton>
      </QuickActions>
    </PreviewCard>
  );
};

export default SubstancePreview;