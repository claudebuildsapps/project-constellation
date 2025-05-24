import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { populateCategoriesWithSubstances } from '../data/categories';
import ExplorerGrid from './explorer/ExplorerGrid';
import { SearchBar } from './SearchBar';

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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const CategoryCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

const SubstanceCount = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[700]};
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: inline-block;
`;

const SubstanceList = styled.div<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: ${props => props.expanded ? '16px' : '0'};
`;

const SubstanceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SubstanceName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const SubstanceType = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  background: ${props => props.theme.colors.background.tertiary};
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.sm};
`;

interface SubstancePreview {
  name: string;
  type: string;
}

// Enhanced categories with top 10 substances as per specification
const categories: (any & { substances: any[] })[] = [
  {
    id: 'stimulants',
    name: 'Stimulants',
    icon: '💊',
    description: 'Substances that increase alertness, attention, and energy',
    color: '#ef4444',
    substances: [
      { name: 'Caffeine', type: 'OTC' },
      { name: 'Adderall (Amphetamine)', type: 'Pharmaceutical' },
      { name: 'Ritalin (Methylphenidate)', type: 'Pharmaceutical' },
      { name: 'Vyvanse (Lisdexamfetamine)', type: 'Pharmaceutical' },
      { name: 'Cocaine', type: 'Recreational' },
      { name: 'Methamphetamine', type: 'Recreational' },
      { name: 'Nicotine', type: 'Legal' },
      { name: 'Modafinil', type: 'Pharmaceutical' },
      { name: 'MDMA', type: 'Recreational' },
      { name: 'Ephedrine', type: 'Supplement' }
    ]
  },
  {
    id: 'depressants',
    name: 'Depressants',
    icon: '🌙',
    description: 'Substances that reduce arousal and stimulation',
    color: '#3b82f6',
    substances: [
      { name: 'Alcohol', type: 'Legal' },
      { name: 'Xanax (Alprazolam)', type: 'Pharmaceutical' },
      { name: 'Valium (Diazepam)', type: 'Pharmaceutical' },
      { name: 'Ambien (Zolpidem)', type: 'Pharmaceutical' },
      { name: 'Klonopin (Clonazepam)', type: 'Pharmaceutical' },
      { name: 'Ativan (Lorazepam)', type: 'Pharmaceutical' },
      { name: 'Barbiturates', type: 'Pharmaceutical' },
      { name: 'GHB', type: 'Recreational' },
      { name: 'Rohypnol', type: 'Pharmaceutical' },
      { name: 'Melatonin', type: 'Supplement' }
    ]
  },
  {
    id: 'hallucinogens',
    name: 'Hallucinogens',
    icon: '🌈',
    description: 'Substances that alter perception and consciousness',
    color: '#8b5cf6',
    substances: [
      { name: 'LSD', type: 'Recreational' },
      { name: 'Psilocybin', type: 'Recreational' },
      { name: 'DMT', type: 'Recreational' },
      { name: 'Mescaline', type: 'Recreational' },
      { name: 'Ketamine', type: 'Pharmaceutical' },
      { name: 'PCP', type: 'Recreational' },
      { name: 'Salvia', type: 'Legal' },
      { name: '2C-B', type: 'Recreational' },
      { name: 'Ayahuasca', type: 'Recreational' },
      { name: 'DXM', type: 'OTC' }
    ]
  },
  {
    id: 'opioids',
    name: 'Opioids',
    icon: '💉',
    description: 'Pain-relieving substances that affect opioid receptors',
    color: '#f59e0b',
    substances: [
      { name: 'Morphine', type: 'Pharmaceutical' },
      { name: 'Oxycodone', type: 'Pharmaceutical' },
      { name: 'Heroin', type: 'Recreational' },
      { name: 'Fentanyl', type: 'Pharmaceutical' },
      { name: 'Codeine', type: 'Pharmaceutical' },
      { name: 'Hydrocodone', type: 'Pharmaceutical' },
      { name: 'Tramadol', type: 'Pharmaceutical' },
      { name: 'Methadone', type: 'Pharmaceutical' },
      { name: 'Buprenorphine', type: 'Pharmaceutical' },
      { name: 'Kratom', type: 'Supplement' }
    ]
  },
  {
    id: 'anxiolytics',
    name: 'Anxiolytics',
    icon: '🧘',
    description: 'Substances used to treat anxiety and promote calmness',
    color: '#10b981',
    substances: [
      { name: 'Xanax (Alprazolam)', type: 'Pharmaceutical' },
      { name: 'Valium (Diazepam)', type: 'Pharmaceutical' },
      { name: 'Klonopin (Clonazepam)', type: 'Pharmaceutical' },
      { name: 'Ativan (Lorazepam)', type: 'Pharmaceutical' },
      { name: 'Buspirone', type: 'Pharmaceutical' },
      { name: 'Propranolol', type: 'Pharmaceutical' },
      { name: 'Hydroxyzine', type: 'Pharmaceutical' },
      { name: 'L-Theanine', type: 'Supplement' },
      { name: 'Gabapentin', type: 'Pharmaceutical' },
      { name: 'CBD', type: 'Supplement' }
    ]
  },
  {
    id: 'antidepressants',
    name: 'Antidepressants',
    icon: '💭',
    description: 'Substances used to treat depression and mood disorders',
    color: '#06b6d4',
    substances: [
      { name: 'Prozac (Fluoxetine)', type: 'Pharmaceutical' },
      { name: 'Zoloft (Sertraline)', type: 'Pharmaceutical' },
      { name: 'Lexapro (Escitalopram)', type: 'Pharmaceutical' },
      { name: 'Wellbutrin (Bupropion)', type: 'Pharmaceutical' },
      { name: 'Paxil (Paroxetine)', type: 'Pharmaceutical' },
      { name: 'Cymbalta (Duloxetine)', type: 'Pharmaceutical' },
      { name: 'Effexor (Venlafaxine)', type: 'Pharmaceutical' },
      { name: 'Celexa (Citalopram)', type: 'Pharmaceutical' },
      { name: 'Trazodone', type: 'Pharmaceutical' },
      { name: "St. John's Wort", type: 'Supplement' }
    ]
  }
];

const SearchSection = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.active ? props.theme.colors.primary[50] : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary[700] : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background: ${props => props.active ? props.theme.colors.primary[100] : props.theme.colors.primary[25]};
  }
`;

const StatsDisplay = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[600]};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 4px;
`;

const ExplorerView: React.FC = () => {
  const { substances } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Populate categories with actual substance data
  const allCategoriesWithSubstances = populateCategoriesWithSubstances(substances);
  
  // Filter categories based on active filter
  const filteredCategories = activeFilter === 'all' 
    ? allCategoriesWithSubstances
    : allCategoriesWithSubstances.filter(cat => cat.id === activeFilter);

  // Calculate statistics
  const totalSubstances = allCategoriesWithSubstances.reduce((sum, cat) => sum + cat.substances.length, 0);
  const totalCategories = allCategoriesWithSubstances.length;
  const avgSubstancesPerCategory = Math.round(totalSubstances / totalCategories);

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Category clicked: ${categoryId}`);
    // TODO: Implement category-specific actions (analytics, filtering, etc.)
  };

  const filterOptions = [
    { id: 'all', label: 'All Categories', count: totalCategories },
    ...allCategoriesWithSubstances.map(cat => ({
      id: cat.id,
      label: cat.name,
      count: cat.substances.length
    }))
  ];

  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <Title>Explore Substances</Title>
        <Subtitle>
          Browse substances by category and discover their effects on neurotransmitter systems
        </Subtitle>
      </ExplorerHeader>

      <SearchSection>
        <SearchBar />
        
        <FilterControls>
          {filterOptions.map(option => (
            <FilterButton
              key={option.id}
              active={activeFilter === option.id}
              onClick={() => setActiveFilter(option.id)}
            >
              {option.label} ({option.count})
            </FilterButton>
          ))}
        </FilterControls>
      </SearchSection>

      <StatsDisplay>
        <StatItem>
          <StatValue>{totalSubstances}</StatValue>
          <StatLabel>Total Substances</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{totalCategories}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{avgSubstancesPerCategory}</StatValue>
          <StatLabel>Avg per Category</StatLabel>
        </StatItem>
      </StatsDisplay>

      <ExplorerGrid 
        categories={filteredCategories}
        onCategoryClick={handleCategoryClick}
        showHeader={false}
      />
    </ExplorerContainer>
  );
};

export default ExplorerView;