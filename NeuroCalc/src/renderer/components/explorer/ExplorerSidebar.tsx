import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/useAppStore';
import { populateCategoriesWithSubstances } from '../../data/categories';

const SidebarContainer = styled.div`
  padding: 20px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const SidebarTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const SidebarSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const CategoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px; /* Add bottom padding to prevent white area */
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.tertiary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.medium};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary[400]};
    }
  }
`;

const CategoryItem = styled.div<{ categoryColor: string }>`
  margin-bottom: 8px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  background: ${props => props.theme.colors.background.secondary};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.categoryColor}40;
    transform: translateX(2px);
  }
`;

const CategoryHeader = styled.div<{ categoryColor: string }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.categoryColor};
  }

  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
  }
`;

const CategoryIcon = styled.span`
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2px;
`;

const CategoryCount = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
`;


const StatsSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const StatsTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 12px;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const StatValue = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primary[600]};
`;


const ExplorerSidebar: React.FC = () => {
  const { substances, setSelectedSubstance, setView } = useAppStore();

  const categoriesWithSubstances = populateCategoriesWithSubstances(substances);

  const handleCategoryClick = (categoryId: string) => {
    // Dispatch custom event to communicate with ExplorerView
    const category = categoriesWithSubstances.find(cat => cat.id === categoryId);
    if (category) {
      const event = new CustomEvent('categorySelected', {
        detail: { categoryId, category }
      });
      window.dispatchEvent(event);
    }
  };

  const handleSubstanceClick = (substance: any) => {
    setSelectedSubstance(substance);
    setView('effects');
  };

  // Calculate statistics
  const totalSubstances = categoriesWithSubstances.reduce((sum, cat) => sum + cat.substances.length, 0);
  const totalCategories = categoriesWithSubstances.length;
  const avgSubstancesPerCategory = Math.round(totalSubstances / totalCategories);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Categories</SidebarTitle>
        <SidebarSubtitle>
          Browse {totalSubstances} substances across {totalCategories} categories
        </SidebarSubtitle>
      </SidebarHeader>

      <CategoryList>
        {categoriesWithSubstances.map((category) => (
          <CategoryItem
            key={category.id}
            categoryColor={category.color}
          >
            <CategoryHeader
              categoryColor={category.color}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryInfo>
                <CategoryName>{category.name}</CategoryName>
                <CategoryCount>{category.substances.length} substances</CategoryCount>
              </CategoryInfo>
            </CategoryHeader>
          </CategoryItem>
        ))}
        
        <StatsSection>
          <StatsTitle>Quick Stats</StatsTitle>
          <StatsList>
            <StatItem>
              <StatLabel>Total Substances</StatLabel>
              <StatValue>{totalSubstances}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Categories</StatLabel>
              <StatValue>{totalCategories}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Avg per Category</StatLabel>
              <StatValue>{avgSubstancesPerCategory}</StatValue>
            </StatItem>
          </StatsList>
        </StatsSection>
      </CategoryList>
    </SidebarContainer>
  );
};

export default ExplorerSidebar;