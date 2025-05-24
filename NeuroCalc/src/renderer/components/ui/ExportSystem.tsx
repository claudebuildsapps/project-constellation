import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotificationHelpers } from './NotificationSystem';

// Types
interface ExportData {
  substance: {
    name: string;
    dosage: number;
    route: string;
    unit: string;
  };
  effects: {
    timestamp: number;
    confidence: number;
    neurotransmitters: {
      dopamine: number;
      serotonin: number;
      norepinephrine: number;
    };
    timeProfile?: Array<{ time: number; intensity: number }>;
  };
  metadata: {
    version: string;
    exportDate: string;
    calculationMethod: string;
  };
}

type ExportFormat = 'json' | 'csv' | 'pdf' | 'png';

interface ExportOptions {
  format: ExportFormat;
  includeTimeProfile: boolean;
  includeMetadata: boolean;
  includeChart: boolean;
}

// Styled Components
const ExportContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const ExportHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ExportIcon = styled.div`
  font-size: 24px;
  color: ${props => props.theme.colors.primary[500]};
`;

const ExportTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const FormatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const FormatCard = styled.button.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
})<{ selected: boolean }>`
  padding: 16px;
  border: 2px solid ${props => 
    props.selected 
      ? props.theme.colors.primary[500] 
      : props.theme.colors.border.light
  };
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => 
    props.selected 
      ? props.theme.colors.primary[50] 
      : props.theme.colors.background.secondary
  };
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background: ${props => props.theme.colors.primary[50]};
  }
`;

const FormatIcon = styled.div`
  font-size: 24px;
`;

const FormatName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const FormatDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`;

const OptionsSection = styled.div`
  margin-bottom: 24px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const OptionCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary[500]};
`;

const ExportActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ExportButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary[600]};
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.md};
    }
  ` : `
    background: ${props.theme.colors.background.tertiary};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.medium};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.background.primary};
      border-color: ${props.theme.colors.border.dark};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const PreviewSection = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const PreviewTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const PreviewContent = styled.pre`
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  background: ${props => props.theme.colors.background.secondary};
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow-x: auto;
  max-height: 200px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

// Format configurations
const exportFormats = {
  json: {
    icon: '📄',
    name: 'JSON',
    description: 'Machine-readable data format',
    extension: 'json',
    mimeType: 'application/json'
  },
  csv: {
    icon: '📊',
    name: 'CSV',
    description: 'Spreadsheet compatible format',
    extension: 'csv',
    mimeType: 'text/csv'
  },
  pdf: {
    icon: '📑',
    name: 'PDF',
    description: 'Formatted report document',
    extension: 'pdf',
    mimeType: 'application/pdf'
  },
  png: {
    icon: '🖼️',
    name: 'PNG',
    description: 'Chart image export',
    extension: 'png',
    mimeType: 'image/png'
  }
};

// Export utility functions
const generateJSON = (data: ExportData, options: ExportOptions): string => {
  const exportData: any = {
    substance: data.substance,
    effects: {
      timestamp: data.effects.timestamp,
      confidence: data.effects.confidence,
      neurotransmitters: data.effects.neurotransmitters
    }
  };

  if (options.includeTimeProfile && data.effects.timeProfile) {
    exportData.effects.timeProfile = data.effects.timeProfile;
  }

  if (options.includeMetadata) {
    exportData.metadata = data.metadata;
  }

  return JSON.stringify(exportData, null, 2);
};

const generateCSV = (data: ExportData, options: ExportOptions): string => {
  const rows = [];
  
  // Header
  rows.push(['Property', 'Value']);
  
  // Substance data
  rows.push(['Substance', data.substance.name]);
  rows.push(['Dosage', `${data.substance.dosage} ${data.substance.unit}`]);
  rows.push(['Route', data.substance.route]);
  rows.push(['Timestamp', new Date(data.effects.timestamp).toISOString()]);
  rows.push(['Confidence', `${data.effects.confidence}%`]);
  
  // Neurotransmitter effects
  rows.push(['Dopamine Activity', `${data.effects.neurotransmitters.dopamine}%`]);
  rows.push(['Serotonin Activity', `${data.effects.neurotransmitters.serotonin}%`]);
  rows.push(['Norepinephrine Activity', `${data.effects.neurotransmitters.norepinephrine}%`]);

  if (options.includeTimeProfile && data.effects.timeProfile) {
    rows.push(['', '']); // Empty row
    rows.push(['Time Profile', '']);
    rows.push(['Time (minutes)', 'Intensity']);
    data.effects.timeProfile.forEach(point => {
      rows.push([point.time.toString(), point.intensity.toString()]);
    });
  }

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Main Export Component
interface ExportSystemProps {
  data: ExportData | null;
  onClose?: () => void;
}

export const ExportSystem: React.FC<ExportSystemProps> = ({ data, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'json',
    includeTimeProfile: true,
    includeMetadata: true,
    includeChart: false
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const { showSuccess, showError } = useNotificationHelpers();

  const handleFormatChange = (format: ExportFormat) => {
    setSelectedFormat(format);
    setOptions(prev => ({ ...prev, format }));
  };

  const handleOptionChange = (option: keyof ExportOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };

  const generatePreview = (): string => {
    if (!data) return 'No data available for export';

    try {
      switch (selectedFormat) {
        case 'json':
          return generateJSON(data, options);
        case 'csv':
          return generateCSV(data, options);
        case 'pdf':
          return 'PDF preview not available - will generate formatted report';
        case 'png':
          return 'PNG preview not available - will export chart image';
        default:
          return 'Unknown format';
      }
    } catch (error) {
      return `Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleExport = async () => {
    if (!data) {
      showError('Export Error', 'No data available to export');
      return;
    }

    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `neurocalc-${data.substance.name.toLowerCase()}-${timestamp}.${exportFormats[selectedFormat].extension}`;

      switch (selectedFormat) {
        case 'json': {
          const content = generateJSON(data, options);
          downloadFile(content, filename, exportFormats.json.mimeType);
          break;
        }
        case 'csv': {
          const content = generateCSV(data, options);
          downloadFile(content, filename, exportFormats.csv.mimeType);
          break;
        }
        case 'pdf': {
          // TODO: Implement PDF generation
          showError('Export Error', 'PDF export is not yet implemented');
          return;
        }
        case 'png': {
          // TODO: Implement chart to PNG export
          showError('Export Error', 'PNG export is not yet implemented');
          return;
        }
      }

      showSuccess(
        'Export Successful',
        `Data exported as ${selectedFormat.toUpperCase()} format`
      );
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      showError(
        'Export Failed',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) {
    return (
      <ExportContainer>
        <ExportHeader>
          <ExportIcon>📤</ExportIcon>
          <ExportTitle>Export Results</ExportTitle>
        </ExportHeader>
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
          No calculation results available to export.
          <br />
          Please calculate effects for a substance first.
        </div>
      </ExportContainer>
    );
  }

  return (
    <ExportContainer>
      <ExportHeader>
        <ExportIcon>📤</ExportIcon>
        <ExportTitle>Export Results</ExportTitle>
      </ExportHeader>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
          Select Format
        </h4>
        <FormatGrid>
          {Object.entries(exportFormats).map(([format, config]) => (
            <FormatCard
              key={format}
              selected={selectedFormat === format}
              onClick={() => handleFormatChange(format as ExportFormat)}
            >
              <FormatIcon>{config.icon}</FormatIcon>
              <FormatName>{config.name}</FormatName>
              <FormatDescription>{config.description}</FormatDescription>
            </FormatCard>
          ))}
        </FormatGrid>
      </div>

      <OptionsSection>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
          Export Options
        </h4>
        <OptionLabel>
          <OptionCheckbox
            type="checkbox"
            checked={options.includeTimeProfile}
            onChange={(e) => handleOptionChange('includeTimeProfile', e.target.checked)}
          />
          Include time profile data
        </OptionLabel>
        <OptionLabel>
          <OptionCheckbox
            type="checkbox"
            checked={options.includeMetadata}
            onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
          />
          Include calculation metadata
        </OptionLabel>
        {(selectedFormat === 'pdf' || selectedFormat === 'png') && (
          <OptionLabel>
            <OptionCheckbox
              type="checkbox"
              checked={options.includeChart}
              onChange={(e) => handleOptionChange('includeChart', e.target.checked)}
            />
            Include visualization charts
          </OptionLabel>
        )}
      </OptionsSection>

      <PreviewSection>
        <PreviewTitle>Preview</PreviewTitle>
        <PreviewContent>{generatePreview()}</PreviewContent>
      </PreviewSection>

      <ExportActions>
        {onClose && (
          <ExportButton onClick={onClose}>
            Cancel
          </ExportButton>
        )}
        <ExportButton 
          variant="primary" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? '⏳ Exporting...' : `📤 Export ${selectedFormat.toUpperCase()}`}
        </ExportButton>
      </ExportActions>
    </ExportContainer>
  );
};

export default ExportSystem;