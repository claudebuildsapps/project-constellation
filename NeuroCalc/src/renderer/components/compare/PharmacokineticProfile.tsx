import React from 'react';
import styled from 'styled-components';
import { Substance } from '../../types';

interface PharmacokineticProfileProps {
  substances: (Substance | null)[];
  route: string;
  className?: string;
}

const ProfileContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const ProfileTitle = styled.h3`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RouteIndicator = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProfileGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const SubstanceCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SubstanceName = styled.h4`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubstanceIcon = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const PropertySection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const PropertyValue = styled.div`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 500;
`;

const TimelineContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
`;

const TimelineBar = styled.div<{ phase: string; duration: number; maxDuration: number }>`
  height: 8px;
  border-radius: 4px;
  margin: 4px 0;
  position: relative;
  background: ${props => {
    switch (props.phase) {
      case 'onset': return '#ff6b6b';
      case 'comeup': return '#ffa726';
      case 'peak': return '#66bb6a';
      case 'offset': return '#42a5f5';
      default: return '#757575';
    }
  }};
  width: ${props => Math.max(10, (props.duration / props.maxDuration) * 100)}%;
`;

const TimelineLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  text-align: center;
`;

const WarningBadge = styled.div`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
  margin-top: 4px;
`;

const PharmacokineticProfile: React.FC<PharmacokineticProfileProps> = ({
  substances,
  route,
  className
}) => {
  const validSubstances = substances.filter((s): s is Substance => s !== null);

  const getSubstanceColor = (index: number): string => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[index % colors.length];
  };

  const getRouteData = (substance: Substance, route: string) => {
    return substance.dosageRanges.find(r => r.route.toLowerCase() === route.toLowerCase());
  };

  const formatDuration = (duration: any): string => {
    if (!duration) return 'Unknown';
    if (typeof duration === 'number') return `${duration} min`;
    return `${duration.min || 0}-${duration.max || 0} min`;
  };

  const getDurationNumber = (duration: any): number => {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    return duration.max || duration.min || 0;
  };

  const generateMockPharmacokinetics = (substance: Substance, route: string) => {
    // Generate realistic pharmacokinetic data based on substance class and route
    const routeData = getRouteData(substance, route);
    if (!routeData) return null;

    const baseData = {
      bioavailability: route === 'oral' ? '60-80%' : route === 'iv' ? '100%' : '85-95%',
      absorption: route === 'oral' ? '30-120 min' : route === 'iv' ? 'Immediate' : '5-30 min',
      distribution: 'Widely distributed',
      metabolism: 'Hepatic (CYP2D6, CYP3A4)',
      elimination: 'Renal (70%), Fecal (30%)',
      halfLife: '4-8 hours',
      clearance: '400-600 mL/min',
      volumeOfDistribution: '3-5 L/kg'
    };

    // Adjust based on substance class
    if (substance.category.includes('psychedelic')) {
      baseData.halfLife = '6-12 hours';
      baseData.metabolism = 'Hepatic (MAO-A, CYP2D6)';
    } else if (substance.category.includes('stimulant')) {
      baseData.halfLife = '2-4 hours';
      baseData.clearance = '800-1200 mL/min';
    } else if (substance.category.includes('depressant')) {
      baseData.halfLife = '8-24 hours';
      baseData.clearance = '200-400 mL/min';
    }

    return baseData;
  };

  if (validSubstances.length === 0) {
    return (
      <ProfileContainer className={className}>
        <ProfileHeader>
          <ProfileTitle>
            🧬 Pharmacokinetic Profiles
          </ProfileTitle>
          <RouteIndicator>{route}</RouteIndicator>
        </ProfileHeader>
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div>Select substances to view pharmacokinetic profiles</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Absorption, distribution, metabolism, and elimination data
          </div>
        </EmptyState>
      </ProfileContainer>
    );
  }

  const maxDuration = Math.max(
    ...validSubstances.map(s => {
      return s.pharmacokinetics?.duration?.max || 0;
    })
  );

  return (
    <ProfileContainer className={className}>
      <ProfileHeader>
        <ProfileTitle>
          🧬 Pharmacokinetic Profiles
        </ProfileTitle>
        <RouteIndicator>{route}</RouteIndicator>
      </ProfileHeader>

      <ProfileGrid>
        {validSubstances.map((substance, index) => {
          const routeData = getRouteData(substance, route);
          const pharmacokinetics = generateMockPharmacokinetics(substance, route);
          
          if (!routeData || !pharmacokinetics) {
            return (
              <SubstanceCard key={substance.id}>
                <SubstanceName>
                  <SubstanceIcon color={getSubstanceColor(index)} />
                  {substance.name}
                </SubstanceName>
                <EmptyState style={{ padding: '20px' }}>
                  <div>❌</div>
                  <div>No {route} route data</div>
                </EmptyState>
              </SubstanceCard>
            );
          }

          return (
            <SubstanceCard key={substance.id}>
              <SubstanceName>
                <SubstanceIcon color={getSubstanceColor(index)} />
                {substance.name}
              </SubstanceName>

              <PropertySection>
                <PropertyLabel>Absorption & Bioavailability</PropertyLabel>
                <PropertyValue>{pharmacokinetics.bioavailability}</PropertyValue>
                <PropertyValue style={{ fontSize: '12px', opacity: 0.8 }}>
                  Absorption: {pharmacokinetics.absorption}
                </PropertyValue>
              </PropertySection>

              <PropertySection>
                <PropertyLabel>Dosage Information</PropertyLabel>
                {routeData && (
                  <TimelineContainer>
                    <PropertyValue>
                      Light: {routeData.light}{routeData.unit} | 
                      Common: {routeData.common}{routeData.unit} | 
                      Strong: {routeData.strong}{routeData.unit}
                    </PropertyValue>
                    {substance.pharmacokinetics && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Onset: {substance.pharmacokinetics.onset.min}-{substance.pharmacokinetics.onset.max} min
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Duration: {substance.pharmacokinetics.duration.min}-{substance.pharmacokinetics.duration.max} hours
                        </div>
                      </div>
                    )}
                  </TimelineContainer>
                )}
              </PropertySection>

              <PropertySection>
                <PropertyLabel>Metabolism & Elimination</PropertyLabel>
                <PropertyValue>{pharmacokinetics.metabolism}</PropertyValue>
                <PropertyValue style={{ fontSize: '12px', opacity: 0.8 }}>
                  Half-life: {pharmacokinetics.halfLife}
                </PropertyValue>
                <PropertyValue style={{ fontSize: '12px', opacity: 0.8 }}>
                  Clearance: {pharmacokinetics.clearance}
                </PropertyValue>
              </PropertySection>

              <PropertySection>
                <PropertyLabel>Distribution</PropertyLabel>
                <PropertyValue>{pharmacokinetics.volumeOfDistribution}</PropertyValue>
                <PropertyValue style={{ fontSize: '12px', opacity: 0.8 }}>
                  {pharmacokinetics.distribution}
                </PropertyValue>
              </PropertySection>

              {substance.warnings && substance.warnings.length > 0 && (
                <PropertySection>
                  <PropertyLabel>Pharmacokinetic Warnings</PropertyLabel>
                  {substance.warnings.slice(0, 2).map((warning, idx) => (
                    <WarningBadge key={idx}>
                      ⚠️ {warning.length > 30 ? warning.substring(0, 30) + '...' : warning}
                    </WarningBadge>
                  ))}
                </PropertySection>
              )}
            </SubstanceCard>
          );
        })}
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default PharmacokineticProfile;