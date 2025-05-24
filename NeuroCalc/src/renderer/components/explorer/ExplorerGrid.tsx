import React from 'react';
import styled from 'styled-components';
import { SubstanceCategory } from '../../types';
import CategoryCard from './CategoryCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 32px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const GridHeader = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 16px;
`;

const GridTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const GridSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin: 0 0 8px 0;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const EmptyStateSubtext = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
  opacity: 0.7;
`;

interface ExplorerGridProps {
  categories: SubstanceCategory[];
  title?: string;
  subtitle?: string;
  onCategoryClick?: (categoryId: string) => void;
  showHeader?: boolean;
}

const ExplorerGrid: React.FC<ExplorerGridProps> = ({
  categories,
  title = "Substance Categories",
  subtitle = "Explore substances organized by their primary effects and medical classification",
  onCategoryClick,
  showHeader = true
}) => {
  if (categories.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <EmptyStateText>No categories available</EmptyStateText>
          <EmptyStateSubtext>
            Substance categories are being loaded or none are currently configured.
          </EmptyStateSubtext>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {showHeader && (
        <GridHeader>
          <GridTitle>{title}</GridTitle>
          <GridSubtitle>{subtitle}</GridSubtitle>
        </GridHeader>
      )}
      
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onCategoryClick={onCategoryClick}
        />
      ))}
    </GridContainer>
  );
};

export default ExplorerGrid;