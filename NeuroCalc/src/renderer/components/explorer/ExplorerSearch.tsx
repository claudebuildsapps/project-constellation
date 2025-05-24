import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { SubstanceCategory } from '../../types';

interface ExplorerSearchProps {
  categories: SubstanceCategory[];
  onFilteredCategoriesChange: (filtered: SubstanceCategory[]) => void;
}

const SearchContainer = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary[400]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const FilterChip = styled.button<{ isActive: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => 
    props.isActive ? props.theme.colors.primary[400] : props.theme.colors.border.medium
  };
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => 
    props.isActive ? props.theme.colors.primary[50] : 'transparent'
  };
  color: ${props => 
    props.isActive ? props.theme.colors.primary[700] : props.theme.colors.text.secondary
  };
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => 
      props.isActive ? props.theme.colors.primary[100] : props.theme.colors.background.tertiary
    };
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

const ClearButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  background: transparent;
  color: ${props => props.theme.colors.text.tertiary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ResultsCount = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  padding: 8px 0;
`;

const ExplorerSearch: React.FC<ExplorerSearchProps> = ({
  categories,
  onFilteredCategoriesChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get unique category names for filter chips
  const categoryNames = useMemo(() => {
    return categories.map(cat => cat.name);
  }, [categories]);

  // Filter categories based on search and selected filters
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        substances: category.substances.filter(substance =>
          substance.name.toLowerCase().includes(query) ||
          substance.aliases.some(alias => alias.toLowerCase().includes(query)) ||
          substance.category.toLowerCase().includes(query)
        )
      })).filter(category => category.substances.length > 0);
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(category => 
        selectedCategories.includes(category.name)
      );
    }

    return filtered;
  }, [categories, searchQuery, selectedCategories]);

  // Update parent component when filtered categories change
  React.useEffect(() => {
    onFilteredCategoriesChange(filteredCategories);
  }, [filteredCategories, onFilteredCategoriesChange]);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const hasFilters = searchQuery.trim() || selectedCategories.length > 0;

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search substances by name, alias, or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <FilterContainer>
        <FilterLabel>Categories:</FilterLabel>
        {categoryNames.map(categoryName => (
          <FilterChip
            key={categoryName}
            isActive={selectedCategories.includes(categoryName)}
            onClick={() => handleCategoryToggle(categoryName)}
          >
            {categoryName}
          </FilterChip>
        ))}
        {hasFilters && (
          <ClearButton onClick={handleClearFilters}>
            Clear filters
          </ClearButton>
        )}
      </FilterContainer>

      {hasFilters && (
        <ResultsCount>
          {filteredCategories.length === 0 ? (
            'No categories match your search'
          ) : (
            `Showing ${filteredCategories.length} of ${categories.length} categories`
          )}
        </ResultsCount>
      )}
    </SearchContainer>
  );
};

export default ExplorerSearch;