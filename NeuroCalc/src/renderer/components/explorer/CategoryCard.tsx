import React, { useState } from 'react';
import styled from 'styled-components';
import { SubstanceCategory, Substance } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import SubstancePreview from './SubstancePreview';

interface CategoryCardProps {
  category: SubstanceCategory;
  onCategoryClick?: (categoryId: string) => void;
}

const CardContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

const CategoryHeader = styled.div<{ isExpanded: boolean; categoryColor: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.categoryColor};
    opacity: ${props => props.isExpanded ? 1 : 0.6};
    transition: opacity ${props => props.theme.transitions.fast};
  }
`;

const CategoryIcon = styled.span`
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.tertiary};
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const CategoryDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const SubstanceCount = styled.div<{ categoryColor: string }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background: ${props => props.categoryColor}20;
  color: ${props => props.categoryColor};
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  font-size: 20px;
  color: ${props => props.theme.colors.text.tertiary};
  transition: transform ${props => props.theme.transitions.fast};
  transform: rotate(${props => props.isExpanded ? '180deg' : '0deg'});
`;

const SubstancesList = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '400px' : '0'};
  overflow: hidden;
  transition: max-height ${props => props.theme.transitions.normal};
  border-top: ${props => props.isExpanded ? `1px solid ${props.theme.colors.border.light}` : 'none'};
`;

const SubstancesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 20px;
  background: ${props => props.theme.colors.background.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  background: ${props => props.theme.colors.background.primary};
`;

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onCategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSelectedSubstance, setView } = useAppStore();

  const handleHeaderClick = () => {
    setIsExpanded(!isExpanded);
    onCategoryClick?.(category.id);
  };

  const handleSubstanceSelect = (substance: Substance) => {
    setSelectedSubstance(substance);
    setView('effects');
  };

  return (
    <CardContainer>
      <CategoryHeader 
        isExpanded={isExpanded}
        categoryColor={category.color}
        onClick={handleHeaderClick}
      >
        <CategoryIcon>{category.icon}</CategoryIcon>
        <CategoryInfo>
          <CategoryName>{category.name}</CategoryName>
          <CategoryDescription>{category.description}</CategoryDescription>
        </CategoryInfo>
        <SubstanceCount categoryColor={category.color}>
          {category.substances.length}
          <span>substances</span>
        </SubstanceCount>
        <ExpandIcon isExpanded={isExpanded}>
          ▼
        </ExpandIcon>
      </CategoryHeader>
      
      <SubstancesList isExpanded={isExpanded}>
        {category.substances.length > 0 ? (
          <SubstancesGrid>
            {category.substances.map((substance) => (
              <SubstancePreview
                key={substance.id}
                substance={substance}
                categoryColor={category.color}
                onSelect={handleSubstanceSelect}
              />
            ))}
          </SubstancesGrid>
        ) : (
          <EmptyState>
            No substances available in this category yet
          </EmptyState>
        )}
      </SubstancesList>
    </CardContainer>
  );
};

export default CategoryCard;