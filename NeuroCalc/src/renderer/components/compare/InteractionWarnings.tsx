import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { InteractionWarning, Substance } from '../../types';
import InteractionAnalyzer from '../../utils/interactionAnalyzer';

interface InteractionWarningsProps {
  substances: (Substance | null)[];
  className?: string;
}

const WarningsContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RiskIndicator = styled.div<{ risk: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.risk) {
      case 'critical': return '#f44336';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }};
  color: white;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary[500] : '#ddd'};
  background: ${props => props.active ? props.theme.colors.primary[500] + '20' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.text.secondary};
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary[500]}20;
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const WarningsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WarningCard = styled.div<{ severity: string }>`
  border: 1px solid;
  border-color: ${props => {
    switch (props.severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#ddd';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return '#f4433610';
      case 'high': return '#ff572210';
      case 'medium': return '#ff980010';
      case 'low': return '#4caf5010';
      default: return 'transparent';
    }
  }};
  position: relative;
`;

const WarningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const WarningTitle = styled.h4`
  color: ${props => props.theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SeverityBadge = styled.span<{ severity: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }};
  color: white;
`;

const TypeBadge = styled.span<{ type: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => {
    switch (props.type) {
      case 'synergistic': return '#ff9800';
      case 'antagonistic': return '#2196f3';
      case 'dangerous': return '#f44336';
      case 'contraindicated': return '#9c27b0';
      default: return '#757575';
    }
  }};
  color: white;
  margin-left: 4px;
`;

const WarningDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
  margin: 8px 0;
  line-height: 1.4;
`;

const MechanismText = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
  border-left: 3px solid ${props => props.theme.colors.primary[500]};
`;

const RecommendationText = styled.div`
  background: #f0f8ff;
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #1565c0;
  font-weight: 500;
  border-left: 3px solid #2196f3;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text.secondary};
`;

const RecommendationsList = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary[500]};
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InteractionWarnings: React.FC<InteractionWarningsProps> = ({
  substances,
  className
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>(['critical', 'high', 'medium', 'low']);
  const [expandedWarnings, setExpandedWarnings] = useState<Set<string>>(new Set());

  const interactionResult = useMemo(() => {
    return InteractionAnalyzer.analyzeInteractions(substances);
  }, [substances]);

  const filteredWarnings = useMemo(() => {
    return interactionResult.warnings.filter(warning => 
      activeFilters.includes(warning.severity)
    );
  }, [interactionResult.warnings, activeFilters]);

  const toggleFilter = (severity: string) => {
    setActiveFilters(prev => 
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const toggleWarningExpansion = (warningId: string) => {
    setExpandedWarnings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(warningId)) {
        newSet.delete(warningId);
      } else {
        newSet.add(warningId);
      }
      return newSet;
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'synergistic': return '📈';
      case 'antagonistic': return '📉';
      case 'dangerous': return '☠️';
      case 'contraindicated': return '🚫';
      default: return '🔗';
    }
  };

  const validSubstances = substances.filter((s): s is Substance => s !== null);

  if (validSubstances.length < 2) {
    return (
      <WarningsContainer className={className}>
        <Header>
          <Title>⚠️ Interaction Analysis</Title>
        </Header>
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
          <div>Select at least 2 substances to analyze interactions</div>
        </EmptyState>
      </WarningsContainer>
    );
  }

  return (
    <WarningsContainer className={className}>
      <Header>
        <Title>
          ⚠️ Interaction Analysis
        </Title>
        <RiskIndicator risk={interactionResult.overallRisk}>
          {interactionResult.overallRisk} risk
        </RiskIndicator>
      </Header>

      <FilterControls>
        {InteractionAnalyzer.getSeverityLevels().map(level => (
          <FilterButton
            key={level.value}
            active={activeFilters.includes(level.value)}
            onClick={() => toggleFilter(level.value)}
          >
            {getSeverityIcon(level.value)} {level.label}
          </FilterButton>
        ))}
      </FilterControls>

      {filteredWarnings.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
          <div>No interactions found at selected severity levels</div>
          {interactionResult.warnings.length > 0 && (
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              Adjust filters to view all {interactionResult.warnings.length} interactions
            </div>
          )}
        </EmptyState>
      ) : (
        <WarningsList>
          {filteredWarnings.map((warning, index) => (
            <WarningCard 
              key={`warning-${index}`} 
              severity={warning.severity}
              onClick={() => toggleWarningExpansion(`warning-${index}`)}
              style={{ cursor: 'pointer' }}
            >
              <WarningHeader>
                <WarningTitle>
                  {getSeverityIcon(warning.severity)}
                  {getTypeIcon(warning.type)}
                  {`${warning.substances[0]} + ${warning.substances[1]}`}
                </WarningTitle>
                <div>
                  <SeverityBadge severity={warning.severity}>
                    {warning.severity}
                  </SeverityBadge>
                  <TypeBadge type={warning.type}>
                    {warning.type}
                  </TypeBadge>
                </div>
              </WarningHeader>

              <WarningDescription>
                {warning.description}
              </WarningDescription>

              {expandedWarnings.has(`warning-${index}`) && (
                <>
                  <MechanismText>
                    <strong>Type:</strong> {warning.type}
                  </MechanismText>
                  <RecommendationText>
                    <strong>Recommendations:</strong> {warning.recommendations.join(', ')}
                  </RecommendationText>
                </>
              )}
            </WarningCard>
          ))}
        </WarningsList>
      )}

      {interactionResult.recommendedActions.length > 0 && (
        <RecommendationsList>
          <Title style={{ fontSize: '16px', marginBottom: '12px' }}>
            💡 General Recommendations
          </Title>
          {interactionResult.recommendedActions.map((action, index) => (
            <RecommendationItem key={index}>
              <span style={{ minWidth: '16px' }}>•</span>
              <span>{action}</span>
            </RecommendationItem>
          ))}
        </RecommendationsList>
      )}
    </WarningsContainer>
  );
};

export default InteractionWarnings;