import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { populateCategoriesWithSubstances } from '../data/categories';
import { SubstanceCategory, Substance } from '../types';

const ExplorerContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ExplorerHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const SubstancesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

const SubstanceCard = styled.div<{ categoryColor: string }>`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.categoryColor};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.categoryColor};
  }
`;

const SubstanceCardName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const SubstanceAliases = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 12px;
  font-style: italic;
`;

const SubstanceCardType = styled.span<{ categoryColor: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.categoryColor}20;
  color: ${props => props.categoryColor};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryDisplay = styled.div<{ categoryColor: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.categoryColor};
  }
`;

const CategoryDisplayIcon = styled.span`
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.tertiary};
`;

const CategoryDisplayInfo = styled.div`
  flex: 1;
`;

const CategoryDisplayName = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const CategoryDisplayDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const CategoryDisplayCount = styled.div<{ categoryColor: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.categoryColor}15;
  border-radius: ${props => props.theme.borderRadius.md};
  
  span {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.categoryColor};
  }
  
  small {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.text.secondary};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin: 0 0 12px 0;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin: 0;
    font-style: italic;
  }
`;

// Helper function to get substance type
const getSubstanceType = (substanceName: string): string => {
  const name = substanceName.toLowerCase();
  
  if (name.includes('adderall') || name.includes('ritalin') || name.includes('vyvanse') ||
      name.includes('xanax') || name.includes('valium') || name.includes('prozac') ||
      name.includes('zoloft') || name.includes('morphine') || name.includes('oxycodone')) {
    return 'Pharmaceutical';
  }
  
  if (name.includes('caffeine') || name.includes('melatonin') || name.includes('theanine') ||
      name.includes('cbd') || name.includes('kratom') || name.includes('st. john')) {
    return 'Supplement';
  }
  
  if (name.includes('alcohol') || name.includes('nicotine') || name.includes('salvia')) {
    return 'Legal';
  }
  
  return 'Recreational';
};

// Create a custom event system for category selection
declare global {
  interface WindowEventMap {
    'categorySelected': CustomEvent<{ categoryId: string; category: SubstanceCategory }>;
  }
}

const ExplorerView: React.FC = () => {
  const { substances, setSelectedSubstance, setView } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | null>(null);

  const categoriesWithSubstances = populateCategoriesWithSubstances(substances);

  // Listen for category selection from sidebar
  useEffect(() => {
    const handleCategorySelected = (event: CustomEvent<{ categoryId: string; category: SubstanceCategory }>) => {
      setSelectedCategory(event.detail.category);
    };

    window.addEventListener('categorySelected', handleCategorySelected);
    return () => window.removeEventListener('categorySelected', handleCategorySelected);
  }, []);

  const handleSubstanceClick = (substance: Substance) => {
    setSelectedSubstance(substance);
    setView('effects');
  };

  if (selectedCategory) {
    return (
      <ExplorerContainer>
        <CategoryDisplay categoryColor={selectedCategory.color}>
          <CategoryDisplayIcon>{selectedCategory.icon}</CategoryDisplayIcon>
          <CategoryDisplayInfo>
            <CategoryDisplayName>{selectedCategory.name}</CategoryDisplayName>
            <CategoryDisplayDescription>{selectedCategory.description}</CategoryDisplayDescription>
          </CategoryDisplayInfo>
          <CategoryDisplayCount categoryColor={selectedCategory.color}>
            <span>{selectedCategory.substances.length}</span>
            <small>substances</small>
          </CategoryDisplayCount>
        </CategoryDisplay>

        <SubstancesGrid>
          {selectedCategory.substances.map((substance) => (
            <SubstanceCard
              key={substance.id}
              categoryColor={selectedCategory.color}
              onClick={() => handleSubstanceClick(substance)}
            >
              <SubstanceCardName>{substance.name}</SubstanceCardName>
              {substance.aliases.length > 0 && (
                <SubstanceAliases>
                  Also known as: {substance.aliases.slice(0, 2).join(', ')}
                  {substance.aliases.length > 2 && '...'}
                </SubstanceAliases>
              )}
              <SubstanceCardType categoryColor={selectedCategory.color}>
                {getSubstanceType(substance.name)}
              </SubstanceCardType>
            </SubstanceCard>
          ))}
        </SubstancesGrid>
      </ExplorerContainer>
    );
  }

  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <Title>Explore Substances</Title>
        <Subtitle>
          Select a category from the left panel to view substances in that category
        </Subtitle>
      </ExplorerHeader>
      
      <EmptyState>
        <h3>Choose a Category</h3>
        <p>Click on any category in the left sidebar to explore its substances here.</p>
      </EmptyState>
    </ExplorerContainer>
  );
};

export default ExplorerView;