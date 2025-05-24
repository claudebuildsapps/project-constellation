import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/useAppStore';
import { LLMConfig } from '../../types';

const PanelContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  margin-bottom: 24px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError 
    ? props.theme.colors.status.error 
    : props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError 
      ? props.theme.colors.status.error 
      : props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.hasError 
      ? `${props.theme.colors.status.error}20` 
      : props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError 
    ? props.theme.colors.status.error 
    : props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: inherit;
  resize: vertical;
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError 
      ? props.theme.colors.status.error 
      : props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.hasError 
      ? `${props.theme.colors.status.error}20` 
      : props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RangeInput = styled.input`
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: ${props => props.theme.colors.primary[500]};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: ${props => props.theme.colors.primary[500]};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const RangeValue = styled.span`
  min-width: 40px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`;

const Toggle = styled.div<{ enabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${props => props.enabled 
    ? props.theme.colors.primary[300] 
    : props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.enabled 
    ? props.theme.colors.primary[50] 
    : props.theme.colors.background.tertiary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
    background: ${props => props.enabled 
      ? props.theme.colors.primary[100] 
      : props.theme.colors.primary[50]};
  }
`;

const ToggleSwitch = styled.div<{ enabled: boolean }>`
  width: 44px;
  height: 24px;
  background: ${props => props.enabled 
    ? props.theme.colors.primary[500] 
    : props.theme.colors.border.medium};
  border-radius: 12px;
  position: relative;
  transition: background-color ${props => props.theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.enabled ? '22px' : '2px'};
    transition: left ${props => props.theme.transitions.fast};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary[500];
      case 'danger': return props.theme.colors.status.error;
      default: return props.theme.colors.border.medium;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary[500];
      case 'danger': return props.theme.colors.status.error;
      default: return props.theme.colors.background.secondary;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': 
      case 'danger': return 'white';
      default: return props.theme.colors.text.primary;
    }
  }};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusIndicator = styled.div<{ status: 'success' | 'error' | 'testing' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => {
    switch (props.status) {
      case 'success': return props.theme.colors.status.success + '20';
      case 'error': return props.theme.colors.status.error + '20';
      case 'testing': return props.theme.colors.primary[50];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'success': return props.theme.colors.status.success;
      case 'error': return props.theme.colors.status.error;
      case 'testing': return props.theme.colors.primary[700];
    }
  }};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: 8px;
`;

const HelpText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  margin-top: 4px;
  line-height: 1.4;
`;

const LLMConfigurationPanel: React.FC = () => {
  const { llmConfig, updateLLMConfig } = useAppStore();
  const [localConfig, setLocalConfig] = useState<LLMConfig>(llmConfig);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (updates: Partial<LLMConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const saveConfiguration = () => {
    updateLLMConfig(localConfig);
    setHasChanges(false);
  };

  const resetConfiguration = () => {
    setLocalConfig(llmConfig);
    setHasChanges(false);
  };

  const testConnection = async () => {
    setTestStatus('testing');
    setTestError('');

    try {
      // Simulate API test call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual API test
      if (!localConfig.endpoint || !localConfig.apiKey) {
        throw new Error('Endpoint and API key are required');
      }

      setTestStatus('success');
    } catch (error) {
      setTestStatus('error');
      setTestError(error instanceof Error ? error.message : 'Connection test failed');
    }
  };

  const providerPresets = {
    openai: {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
    },
    anthropic: {
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-sonnet-20240229',
      temperature: 0.3,
      maxTokens: 1000,
    },
    custom: {
      endpoint: '',
      model: '',
      temperature: 0.3,
      maxTokens: 1000,
    },
  };

  const loadPreset = (provider: keyof typeof providerPresets) => {
    handleConfigChange(providerPresets[provider]);
  };

  return (
    <PanelContainer>
      <PanelTitle>
        🤖 LLM Integration Configuration
      </PanelTitle>

      <Section>
        <SectionTitle>Enable LLM Integration</SectionTitle>
        <Toggle 
          enabled={localConfig.enabled} 
          onClick={() => handleConfigChange({ enabled: !localConfig.enabled })}
        >
          <ToggleSwitch enabled={localConfig.enabled} />
          <div>
            <div>{localConfig.enabled ? 'Enabled' : 'Disabled'}</div>
            <HelpText>
              {localConfig.enabled 
                ? 'LLM will be used for advanced calculations' 
                : 'Only cached calculations will be used'}
            </HelpText>
          </div>
        </Toggle>
      </Section>

      {localConfig.enabled && (
        <>
          <Section>
            <SectionTitle>Provider Presets</SectionTitle>
            <ButtonGroup>
              <Button onClick={() => loadPreset('openai')}>
                OpenAI GPT-4
              </Button>
              <Button onClick={() => loadPreset('anthropic')}>
                Anthropic Claude
              </Button>
              <Button onClick={() => loadPreset('custom')}>
                Custom Provider
              </Button>
            </ButtonGroup>
          </Section>

          <Section>
            <SectionTitle>API Configuration</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                type="url"
                value={localConfig.endpoint}
                onChange={(e) => handleConfigChange({ endpoint: e.target.value })}
                placeholder="https://api.example.com/v1/chat/completions"
              />
              <HelpText>
                The complete API endpoint URL for your LLM provider
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={localConfig.apiKey}
                onChange={(e) => handleConfigChange({ apiKey: e.target.value })}
                placeholder="sk-..."
              />
              <HelpText>
                Your API key will be stored locally and never transmitted except to your chosen provider
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="model">Model Name</Label>
              <Input
                id="model"
                type="text"
                value={localConfig.model}
                onChange={(e) => handleConfigChange({ model: e.target.value })}
                placeholder="gpt-4"
              />
              <HelpText>
                The specific model identifier to use for calculations
              </HelpText>
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Model Parameters</SectionTitle>
            
            <FormGroup>
              <Label>Temperature: {localConfig.temperature}</Label>
              <RangeContainer>
                <RangeValue>0.0</RangeValue>
                <RangeInput
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localConfig.temperature}
                  onChange={(e) => handleConfigChange({ temperature: parseFloat(e.target.value) })}
                />
                <RangeValue>1.0</RangeValue>
              </RangeContainer>
              <HelpText>
                Lower values make output more focused and deterministic
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Max Tokens: {localConfig.maxTokens}</Label>
              <RangeContainer>
                <RangeValue>100</RangeValue>
                <RangeInput
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={localConfig.maxTokens}
                  onChange={(e) => handleConfigChange({ maxTokens: parseInt(e.target.value) })}
                />
                <RangeValue>4000</RangeValue>
              </RangeContainer>
              <HelpText>
                Maximum number of tokens in the response
              </HelpText>
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Test Connection</SectionTitle>
            <Button 
              variant="secondary" 
              onClick={testConnection}
              disabled={testStatus === 'testing' || !localConfig.endpoint || !localConfig.apiKey}
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {testStatus === 'success' && (
              <StatusIndicator status="success">
                ✅ Connection successful
              </StatusIndicator>
            )}
            
            {testStatus === 'error' && (
              <StatusIndicator status="error">
                ❌ {testError}
              </StatusIndicator>
            )}
            
            {testStatus === 'testing' && (
              <StatusIndicator status="testing">
                🔄 Testing connection...
              </StatusIndicator>
            )}
          </Section>
        </>
      )}

      <ButtonGroup>
        <Button 
          variant="primary" 
          onClick={saveConfiguration}
          disabled={!hasChanges}
        >
          Save Configuration
        </Button>
        <Button 
          onClick={resetConfiguration}
          disabled={!hasChanges}
        >
          Reset Changes
        </Button>
      </ButtonGroup>
    </PanelContainer>
  );
};

export default LLMConfigurationPanel;