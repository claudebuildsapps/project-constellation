import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Substance, DosageRange } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const PanelContainer = styled.div<{ position: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px;
  min-height: 400px;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    box-shadow: ${props => props.theme.shadows.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 16px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const PanelTitle = styled.h3<{ position: 'left' | 'right' }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '${props => props.position === 'left' ? 'A' : 'B'}';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: ${props => props.position === 'left' ? props.theme.colors.primary[500] : props.theme.colors.secondary[500]};
    color: white;
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 4px 8px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.background.hover};
    border-color: ${props => props.theme.colors.border.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubstanceSearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SubstanceName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const SubstanceCategory = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: capitalize;
`;

const SelectedSubstanceCard = styled.div<{ color: string }>`
  background: ${props => props.theme.colors.background.primary};
  border: 2px solid ${props => props.color}40;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 16px;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color};
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
`;

const SubstanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const SubstanceInfo = styled.div`
  flex: 1;
`;

const SubstanceTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const CategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  background: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
`;

const DosageControls = styled.div`
  margin-top: 16px;
`;

const ControlGroup = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

const DosageInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const DosageInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.secondary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

const UnitDisplay = styled.span`
  padding: 8px 12px;
  background: ${props => props.theme.colors.background.tertiary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  min-width: 50px;
  text-align: center;
`;

const DosageHints = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const DosageHint = styled.button<{ level: 'light' | 'common' | 'strong' }>`
  background: none;
  border: 1px solid ${props => {
    switch (props.level) {
      case 'light': return props.theme.colors.green[300];
      case 'common': return props.theme.colors.blue[300];
      case 'strong': return props.theme.colors.orange[300];
      default: return props.theme.colors.border.medium;
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'light': return props.theme.colors.green[700];
      case 'common': return props.theme.colors.blue[700];
      case 'strong': return props.theme.colors.orange[700];
      default: return props.theme.colors.text.secondary;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 4px 8px;
  font-size: ${props => props.theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => {
      switch (props.level) {
        case 'light': return props.theme.colors.green[50];
        case 'common': return props.theme.colors.blue[50];
        case 'strong': return props.theme.colors.orange[50];
        default: return props.theme.colors.background.hover;
      }
    }};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyText = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 8px;
`;

const EmptyHint = styled.div`
  color: ${props => props.theme.colors.text.tertiary};
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

interface SubstancePanelProps {
  position: 'left' | 'right';
  substance: Substance | null;
  dosage: number;
  route: string;
  onSubstanceChange: (substance: Substance | null) => void;
  onDosageChange: (dosage: number) => void;
  onRouteChange: (route: string) => void;
}

const SubstancePanel: React.FC<SubstancePanelProps> = ({
  position,
  substance,
  dosage,
  route,
  onSubstanceChange,
  onDosageChange,
  onRouteChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const substances = useAppStore(state => state.substances);

  const filteredSubstances = useMemo(() => {
    if (!searchTerm) return substances.slice(0, 10);
    
    return substances.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [substances, searchTerm]);

  const currentDosageRange = useMemo(() => {
    if (!substance) return null;
    return substance.dosageRanges.find(range => range.route === route);
  }, [substance, route]);

  const availableRoutes = useMemo(() => {
    if (!substance) return [];
    return substance.dosageRanges.map(range => range.route);
  }, [substance]);

  const handleSubstanceSelect = (selectedSubstance: Substance) => {
    onSubstanceChange(selectedSubstance);
    setSearchTerm('');
    setShowResults(false);
    
    // Auto-select first available route if current route not available
    const firstRoute = selectedSubstance.dosageRanges[0]?.route;
    if (firstRoute && !selectedSubstance.dosageRanges.some(r => r.route === route)) {
      onRouteChange(firstRoute);
    }
  };

  const handleDosageHintClick = (level: 'light' | 'common' | 'strong') => {
    if (!currentDosageRange) return;
    onDosageChange(currentDosageRange[level]);
  };

  const handleClear = () => {
    onSubstanceChange(null);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <PanelContainer position={position}>
      <PanelHeader>
        <PanelTitle position={position}>
          Substance {position === 'left' ? 'A' : 'B'}
        </PanelTitle>
        {substance && (
          <ClearButton onClick={handleClear}>
            Clear
          </ClearButton>
        )}
      </PanelHeader>

      {!substance ? (
        <>
          <SubstanceSearchContainer>
            <SearchInput
              type="text"
              placeholder="Search substances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
            {showResults && searchTerm && (
              <SearchResults>
                {filteredSubstances.map((s) => (
                  <SearchResultItem
                    key={s.id}
                    onClick={() => handleSubstanceSelect(s)}
                  >
                    <SubstanceName>{s.name}</SubstanceName>
                    <SubstanceCategory>{s.category}</SubstanceCategory>
                  </SearchResultItem>
                ))}
                {filteredSubstances.length === 0 && (
                  <SearchResultItem>
                    <SubstanceName>No results found</SubstanceName>
                  </SearchResultItem>
                )}
              </SearchResults>
            )}
          </SubstanceSearchContainer>

          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>No substance selected</EmptyText>
            <EmptyHint>Search and select a substance to compare</EmptyHint>
          </EmptyState>
        </>
      ) : (
        <>
          <SelectedSubstanceCard color={substance.color}>
            <SubstanceHeader>
              <SubstanceInfo>
                <SubstanceTitle>{substance.name}</SubstanceTitle>
                <CategoryBadge color={substance.color}>
                  {substance.category}
                </CategoryBadge>
              </SubstanceInfo>
            </SubstanceHeader>

            <DosageControls>
              <ControlGroup>
                <Label>Route of Administration</Label>
                <Select
                  value={route}
                  onChange={(e) => onRouteChange(e.target.value)}
                >
                  {availableRoutes.map((availableRoute) => (
                    <option key={availableRoute} value={availableRoute}>
                      {availableRoute.charAt(0).toUpperCase() + availableRoute.slice(1)}
                    </option>
                  ))}
                </Select>
              </ControlGroup>

              <ControlGroup>
                <Label>Dosage</Label>
                <DosageInputContainer>
                  <DosageInput
                    type="number"
                    value={dosage}
                    onChange={(e) => onDosageChange(Number(e.target.value))}
                    min={0}
                    step={0.1}
                  />
                  <UnitDisplay>
                    {currentDosageRange?.unit || 'mg'}
                  </UnitDisplay>
                </DosageInputContainer>

                {currentDosageRange && (
                  <DosageHints>
                    <DosageHint
                      level="light"
                      onClick={() => handleDosageHintClick('light')}
                    >
                      Light: {currentDosageRange.light}{currentDosageRange.unit}
                    </DosageHint>
                    <DosageHint
                      level="common"
                      onClick={() => handleDosageHintClick('common')}
                    >
                      Common: {currentDosageRange.common}{currentDosageRange.unit}
                    </DosageHint>
                    <DosageHint
                      level="strong"
                      onClick={() => handleDosageHintClick('strong')}
                    >
                      Strong: {currentDosageRange.strong}{currentDosageRange.unit}
                    </DosageHint>
                  </DosageHints>
                )}
              </ControlGroup>
            </DosageControls>
          </SelectedSubstanceCard>
        </>
      )}
    </PanelContainer>
  );
};

export default SubstancePanel;