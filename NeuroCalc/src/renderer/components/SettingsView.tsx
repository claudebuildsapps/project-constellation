import React, { useState } from 'react';
import styled from 'styled-components';
import { useSettingsStore } from '../store/useSettingsStore';
import LLMConfigurationPanel from './settings/LLMConfigurationPanel';

const SettingsContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

const TabContainer = styled.div`
  margin-bottom: 24px;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: 24px;
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-bottom: 2px solid ${props => props.active 
    ? props.theme.colors.primary[500] 
    : 'transparent'};
  background: transparent;
  color: ${props => props.active 
    ? props.theme.colors.primary[600] 
    : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.active 
    ? props.theme.typography.fontWeight.semibold 
    : props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background: ${props => props.theme.colors.primary[25]};
  }
`;

const SettingsPanel = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  margin-bottom: 24px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const SettingGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border.light};
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
      default: return props.theme.colors.background.tertiary;
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

type SettingsTab = 'general' | 'llm' | 'privacy' | 'about';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const renderGeneralSettings = () => (
    <>

      <SettingsPanel>
        <PanelTitle>Default Values</PanelTitle>
        <SettingGroup>
          <SettingLabel>Default Route:</SettingLabel>
          <Select
            value={settings.defaultRoute}
            onChange={(e) => updateSettings({ defaultRoute: e.target.value })}
          >
            <option value="oral">Oral</option>
            <option value="nasal">Nasal</option>
            <option value="iv">Intravenous</option>
            <option value="sublingual">Sublingual</option>
          </Select>
        </SettingGroup>
        
        <SettingGroup>
          <SettingLabel>Default Unit:</SettingLabel>
          <Select
            value={settings.defaultUnit}
            onChange={(e) => updateSettings({ defaultUnit: e.target.value })}
          >
            <option value="mg">Milligrams (mg)</option>
            <option value="ug">Micrograms (μg)</option>
            <option value="ml">Milliliters (ml)</option>
          </Select>
        </SettingGroup>
      </SettingsPanel>

      <SettingsPanel>
        <PanelTitle>Behavior</PanelTitle>
        <SettingGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={settings.autoCalculate}
              onChange={(e) => updateSettings({ autoCalculate: e.target.checked })}
            />
            Auto-calculate effects when dosage changes
          </CheckboxLabel>
        </SettingGroup>
        
        <SettingGroup>
          <SettingLabel>Chart Type:</SettingLabel>
          <Select
            value={settings.chartType}
            onChange={(e) => updateSettings({ chartType: e.target.value as 'line' | 'bar' | 'area' })}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </Select>
        </SettingGroup>
      </SettingsPanel>
    </>
  );

  const renderPrivacySettings = () => (
    <SettingsPanel>
      <PanelTitle>Privacy & Data</PanelTitle>
      <SettingGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={settings.enableDataCollection || false}
            onChange={(e) => updateSettings({ enableDataCollection: e.target.checked })}
          />
          Allow anonymous usage analytics
        </CheckboxLabel>
      </SettingGroup>
      <SettingGroup>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={settings.enableCrashReporting || false}
            onChange={(e) => updateSettings({ enableCrashReporting: e.target.checked })}
          />
          Send crash reports to help improve the application
        </CheckboxLabel>
      </SettingGroup>
    </SettingsPanel>
  );

  const renderAboutSettings = () => (
    <SettingsPanel>
      <PanelTitle>About NeuroCalc</PanelTitle>
      <SettingGroup>
        <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)' }}>
          NeuroCalc is a pharmaceutical neurotransmitter calculator designed for educational 
          and research purposes only. Always consult with healthcare professionals.
        </p>
        <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)' }}>
          Version: 1.0.0
        </p>
        <ButtonGroup>
          <Button variant="secondary">Check for Updates</Button>
          <Button variant="secondary">View License</Button>
        </ButtonGroup>
      </SettingGroup>
    </SettingsPanel>
  );

  return (
    <SettingsContainer>
      <SettingsHeader>
        <Title>Settings</Title>
        <Subtitle>Customize your NeuroCalc experience and preferences</Subtitle>
      </SettingsHeader>
      
      <TabContainer>
        <TabList>
          <Tab
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          >
            General
          </Tab>
          <Tab
            active={activeTab === 'llm'}
            onClick={() => setActiveTab('llm')}
          >
            LLM Integration
          </Tab>
          <Tab
            active={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Data
          </Tab>
          <Tab
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
          >
            About
          </Tab>
        </TabList>

        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'llm' && <LLMConfigurationPanel />}
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'about' && renderAboutSettings()}
      </TabContainer>

      <ButtonGroup>
        <Button variant="secondary" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <Button variant="primary">
          Save Changes
        </Button>
      </ButtonGroup>
    </SettingsContainer>
  );
};

export default SettingsView;