import React, { useState } from 'react';
import styled from 'styled-components';
import { Substance, ComparisonExportOptions } from '../../types';

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '6px 12px';
      case 'lg': return '12px 24px';
      default: return '8px 16px';
    }
  }};
  border: 1px solid;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSize.xs;
      case 'lg': return props.theme.typography.fontSize.base;
      default: return props.theme.typography.fontSize.sm;
    }
  }};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.transitions.fast};
  white-space: nowrap;

  ${props => {
    if (props.disabled) {
      return `
        opacity: 0.5;
        background: ${props.theme.colors.background.tertiary};
        border-color: ${props.theme.colors.border.light};
        color: ${props.theme.colors.text.tertiary};
      `;
    }

    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary[500]};
          border-color: ${props.theme.colors.primary[500]};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.primary[600]};
            border-color: ${props.theme.colors.primary[600]};
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:active {
            background: ${props.theme.colors.primary[700]};
            border-color: ${props.theme.colors.primary[700]};
          }
        `;
      
      case 'danger':
        return `
          background: ${props.theme.colors.red[500]};
          border-color: ${props.theme.colors.red[500]};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.red[600]};
            border-color: ${props.theme.colors.red[600]};
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:active {
            background: ${props.theme.colors.red[700]};
            border-color: ${props.theme.colors.red[700]};
          }
        `;
      
      case 'outline':
        return `
          background: transparent;
          border-color: ${props.theme.colors.border.medium};
          color: ${props.theme.colors.text.primary};
          
          &:hover {
            background: ${props.theme.colors.background.hover};
            border-color: ${props.theme.colors.border.dark};
          }
          
          &:active {
            background: ${props.theme.colors.background.tertiary};
          }
        `;
      
      default: // secondary
        return `
          background: ${props.theme.colors.background.tertiary};
          border-color: ${props.theme.colors.border.medium};
          color: ${props.theme.colors.text.primary};
          
          &:hover {
            background: ${props.theme.colors.background.hover};
            border-color: ${props.theme.colors.border.dark};
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:active {
            background: ${props.theme.colors.border.light};
          }
        `;
    }
  }}
`;

const ButtonIcon = styled.span<{ animate?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  transition: transform ${props => props.theme.transitions.fast};
  
  ${props => props.animate && `
    &:hover {
      transform: rotate(180deg);
    }
  `}
`;

const ExportDropdown = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(4px)' : 'translateY(-4px)'};
  transition: all ${props => props.theme.transitions.fast};
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const DropdownSection = styled.div`
  padding: 8px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border.light};
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }
  
  &:active {
    background: ${props => props.theme.colors.background.tertiary};
  }
`;

const DropdownItemIcon = styled.span`
  font-size: 1.1em;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownItemText = styled.div`
  flex: 1;
`;

const DropdownItemDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 2px;
`;

const StatusIndicator = styled.div<{ status: 'ready' | 'calculating' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'calculating':
        return `
          background: ${props.theme.colors.blue[50]};
          color: ${props.theme.colors.blue[700]};
          border: 1px solid ${props.theme.colors.blue[200]};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.red[50]};
          color: ${props.theme.colors.red[700]};
          border: 1px solid ${props.theme.colors.red[200]};
        `;
      default:
        return `
          background: ${props.theme.colors.green[50]};
          color: ${props.theme.colors.green[700]};
          border: 1px solid ${props.theme.colors.green[200]};
        `;
    }
  }}
`;

const StatusIcon = styled.span<{ animate?: boolean }>`
  ${props => props.animate && `
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

interface ComparisonControlsProps {
  primarySubstance: Substance | null;
  secondarySubstance: Substance | null;
  isCalculating: boolean;
  hasResults: boolean;
  onSwap: () => void;
  onReset: () => void;
  onExport: (options: ComparisonExportOptions) => void;
  onCalculate: () => void;
  calculationError?: string;
}

const ComparisonControls: React.FC<ComparisonControlsProps> = ({
  primarySubstance,
  secondarySubstance,
  isCalculating,
  hasResults,
  onSwap,
  onReset,
  onExport,
  onCalculate,
  calculationError,
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const canSwap = primarySubstance && secondarySubstance;
  const canReset = primarySubstance || secondarySubstance;
  const canCalculate = primarySubstance && secondarySubstance && !isCalculating;
  const canExport = hasResults && !isCalculating;

  const getStatus = (): 'ready' | 'calculating' | 'error' => {
    if (calculationError) return 'error';
    if (isCalculating) return 'calculating';
    return 'ready';
  };

  const handleExport = (format: ComparisonExportOptions['format']) => {
    const options: ComparisonExportOptions = {
      format,
      includeCharts: true,
      includeRawData: true,
      includeCalculations: true,
    };
    onExport(options);
    setShowExportDropdown(false);
  };

  const handleExportAdvanced = (options: ComparisonExportOptions) => {
    onExport(options);
    setShowExportDropdown(false);
  };

  return (
    <ControlsContainer>
      <ControlGroup>
        <StatusIndicator status={getStatus()}>
          <StatusIcon animate={isCalculating}>
            {getStatus() === 'calculating' ? '⚡' : 
             getStatus() === 'error' ? '⚠️' : '✓'}
          </StatusIcon>
          {getStatus() === 'calculating' ? 'Calculating...' :
           getStatus() === 'error' ? 'Calculation Error' :
           hasResults ? 'Results Ready' : 'Ready to Compare'}
        </StatusIndicator>
      </ControlGroup>

      <ControlGroup>
        <Button
          variant="outline"
          onClick={onSwap}
          disabled={!canSwap}
          title="Swap substance positions"
        >
          <ButtonIcon animate>
            ⇄
          </ButtonIcon>
          Swap
        </Button>

        <Button
          variant="secondary"
          onClick={onReset}
          disabled={!canReset}
          title="Clear all substances"
        >
          <ButtonIcon>
            🗑️
          </ButtonIcon>
          Reset
        </Button>

        <Button
          variant="primary"
          onClick={onCalculate}
          disabled={!canCalculate}
          title="Calculate comparison"
        >
          <ButtonIcon>
            {isCalculating ? '⚡' : '🧮'}
          </ButtonIcon>
          {isCalculating ? 'Calculating...' : 'Compare'}
        </Button>

        <ExportDropdown isOpen={showExportDropdown}>
          <Button
            variant="outline"
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={!canExport}
            title="Export comparison results"
          >
            <ButtonIcon>
              📤
            </ButtonIcon>
            Export
            <ButtonIcon>
              {showExportDropdown ? '▲' : '▼'}
            </ButtonIcon>
          </Button>

          <DropdownContent isOpen={showExportDropdown}>
            <DropdownHeader>Export Options</DropdownHeader>
            
            <DropdownSection>
              <DropdownItem onClick={() => handleExport('pdf')}>
                <DropdownItemIcon>📄</DropdownItemIcon>
                <DropdownItemText>
                  PDF Report
                  <DropdownItemDescription>
                    Complete comparison with charts
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
              
              <DropdownItem onClick={() => handleExport('png')}>
                <DropdownItemIcon>🖼️</DropdownItemIcon>
                <DropdownItemText>
                  PNG Image
                  <DropdownItemDescription>
                    Charts and visualizations
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
              
              <DropdownItem onClick={() => handleExport('csv')}>
                <DropdownItemIcon>📊</DropdownItemIcon>
                <DropdownItemText>
                  CSV Data
                  <DropdownItemDescription>
                    Raw comparison data
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
              
              <DropdownItem onClick={() => handleExport('json')}>
                <DropdownItemIcon>🗂️</DropdownItemIcon>
                <DropdownItemText>
                  JSON Export
                  <DropdownItemDescription>
                    Complete data structure
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection>
              <DropdownItem 
                onClick={() => handleExportAdvanced({
                  format: 'pdf',
                  includeCharts: true,
                  includeRawData: false,
                  includeCalculations: false,
                  customTitle: 'Substance Comparison Summary'
                })}
              >
                <DropdownItemIcon>📋</DropdownItemIcon>
                <DropdownItemText>
                  Summary Report
                  <DropdownItemDescription>
                    Charts only, no raw data
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
              
              <DropdownItem 
                onClick={() => handleExportAdvanced({
                  format: 'csv',
                  includeCharts: false,
                  includeRawData: true,
                  includeCalculations: true,
                })}
              >
                <DropdownItemIcon>⚗️</DropdownItemIcon>
                <DropdownItemText>
                  Research Data
                  <DropdownItemDescription>
                    All calculations and raw data
                  </DropdownItemDescription>
                </DropdownItemText>
              </DropdownItem>
            </DropdownSection>
          </DropdownContent>
        </ExportDropdown>
      </ControlGroup>
    </ControlsContainer>
  );
};

export default ComparisonControls;