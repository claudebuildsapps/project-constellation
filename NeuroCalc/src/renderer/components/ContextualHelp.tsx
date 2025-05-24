import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/useAppStore';
import { createLLMService } from '../utils/llmService';
import { NavigationView } from '../types';

const HelpContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})<{ isOpen: boolean }>`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: ${props => props.isOpen ? '400px' : '60px'};
  height: ${props => props.isOpen ? '500px' : '60px'};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.isOpen ? '12px' : '50%'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
`;

const HelpToggle = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})<{ isOpen: boolean }>`
  position: absolute;
  top: ${props => props.isOpen ? '16px' : '50%'};
  right: ${props => props.isOpen ? '16px' : '50%'};
  transform: ${props => props.isOpen ? 'none' : 'translate(50%, -50%)'};
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: ${props => props.isOpen ? 'scale(1.1)' : 'translate(50%, -50%) scale(1.1)'};
  }
`;

const HelpContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})<{ isOpen: boolean }>`
  padding: 60px 20px 20px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease 0.1s;
`;

const HelpHeader = styled.div`
  margin-bottom: 16px;
`;

const HelpTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HelpSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${props => props.theme.colors.textMuted};
  line-height: 1.4;
`;

const HelpSections = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const HelpSection = styled.div`
  margin-bottom: 20px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundHover};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SectionContent = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${props => props.theme.colors.textMuted};
  
  ul {
    margin: 6px 0;
    padding-left: 16px;
  }
  
  li {
    margin: 3px 0;
  }
  
  .highlight {
    background: ${props => props.theme.colors.warningLight};
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 500;
  }
`;

const AIHelpSection = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.theme.colors.infoLight};
  border: 1px solid ${props => props.theme.colors.info};
  border-radius: 8px;
`;

const AIQuery = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const QueryInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const QueryButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.muted};
    cursor: not-allowed;
  }
`;

const AIResponse = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  max-height: 120px;
  overflow-y: auto;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${props => props.theme.colors.textMuted};
  font-size: 12px;
  font-style: italic;
`;

interface ContextualHelpData {
  sections: {
    title: string;
    icon: string;
    content: string[];
    highlights?: string[];
  }[];
  tips: string[];
}

export const ContextualHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [aiResponse, setAIResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const { 
    view, 
    selectedSubstance, 
    currentDosage, 
    effects, 
    llmConfig 
  } = useAppStore();

  // Generate contextual help based on current app state
  const contextualHelp = useMemo((): ContextualHelpData => {
    const baseHelp: ContextualHelpData = {
      sections: [],
      tips: []
    };

    // View-specific help
    switch (view) {
      case 'substances':
        baseHelp.sections.push({
          title: 'Substance Selection',
          icon: '💊',
          content: [
            'Browse substances by category or use the search bar',
            'Click on a substance to view detailed information',
            'Review dosage ranges and effects before proceeding'
          ]
        });

        if (selectedSubstance) {
          baseHelp.sections.push({
            title: 'Dosage Configuration',
            icon: '⚖️',
            content: [
              'Adjust dosage using the slider or input field',
              'Select appropriate administration route',
              'Check dosage against established ranges',
              'Use AI recommendations for personalized guidance'
            ],
            highlights: ['Recommended to start with lower doses']
          });

          if (currentDosage > 0) {
            baseHelp.sections.push({
              title: 'Analysis Ready',
              icon: '📊',
              content: [
                'View real-time neurotransmitter effect calculations',
                'Explore dose-response curves and timelines',
                'Compare effects across different neurotransmitter systems',
                'Use visualization tools to understand mechanisms'
              ],
              highlights: ['Results update in real-time']
            });
          }
        }
        break;

      case 'effects':
        baseHelp.sections.push({
          title: 'Effect Analysis',
          icon: '📊',
          content: [
            'View neurotransmitter activity patterns',
            'Compare different visualization modes',
            'Understand reuptake inhibition vs. release',
            'Monitor confidence levels for accuracy'
          ]
        });

        if (effects) {
          baseHelp.sections.push({
            title: 'Understanding Results',
            icon: '🧠',
            content: [
              'Higher net activity indicates stronger effects',
              'Time profiles show duration and peak intensity',
              'Compare different neurotransmitter systems',
              'Use timeline view for temporal analysis'
            ]
          });
        }
        break;

      case 'settings':
        baseHelp.sections.push({
          title: 'Configuration',
          icon: '⚙️',
          content: [
            'Configure LLM integration for enhanced analysis',
            'Adjust display preferences',
            'Set default dosage units and routes',
            'Enable experimental features'
          ]
        });
        break;

      default:
        baseHelp.sections.push({
          title: 'Getting Started',
          icon: '🚀',
          content: [
            'Select a substance from the left panel',
            'Configure dosage and administration route',
            'Analyze neurotransmitter effects',
            'Calculate and analyze effects'
          ]
        });
    }

    // General tips
    baseHelp.tips = [
      'Use the search bar for natural language queries',
      'Enable LLM integration for enhanced recommendations',
      'Explore different visualization modes for better insights',
      'Compare effects across multiple substances',
      'Export data for further analysis'
    ];


    return baseHelp;
  }, [view, selectedSubstance, currentDosage, effects]);

  const handleAIQuery = async () => {
    if (!customQuery.trim() || !llmConfig.enabled || !llmConfig.endpoint || !llmConfig.apiKey) {
      return;
    }

    setIsLoadingAI(true);
    setAIResponse('');

    try {
      const llmService = createLLMService(llmConfig);
      
      const contextualPrompt = `
Context: User is in ${view} view of NeuroCalc application.
${selectedSubstance ? `Selected substance: ${selectedSubstance.name}` : 'No substance selected'}
${currentDosage > 0 ? `Current dosage: ${currentDosage}mg` : 'No dosage set'}

User question: "${customQuery}"

Provide a helpful, concise response (2-3 sentences max) focused on:
1. Direct answer to the question  
2. Technical details if relevant
3. Next steps or recommendations

Keep response under 200 words and prioritize actionable guidance.
`;

      const response = await fetch(llmConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: llmConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for NeuroCalc, a pharmaceutical neurotransmitter calculator. Provide concise, technical guidance about neurotransmitter effects and pharmacology.'
            },
            {
              role: 'user',
              content: contextualPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI query failed: ${response.status}`);
      }

      const data = await response.json();
      setAIResponse(data.choices[0].message.content);
    } catch (error) {
      setAIResponse(`Unable to get AI assistance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAIQuery();
    }
  };

  return (
    <HelpContainer isOpen={isOpen}>
      <HelpToggle
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '?'}
      </HelpToggle>

      <HelpContent isOpen={isOpen}>
        <HelpHeader>
          <HelpTitle>Contextual Help</HelpTitle>
          <HelpSubtitle>
            Guidance for {view === 'substances' ? 'substance selection' : view === 'effects' ? 'effect analysis' : view}
          </HelpSubtitle>
        </HelpHeader>

        <HelpSections>
          {contextualHelp.sections.map((section, index) => (
            <HelpSection key={index}>
              <SectionTitle>
                {section.icon} {section.title}
              </SectionTitle>
              <SectionContent>
                <ul>
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
                {section.highlights?.map((highlight, hIndex) => (
                  <div key={hIndex} className="highlight">
                    💡 {highlight}
                  </div>
                ))}
              </SectionContent>
            </HelpSection>
          ))}


          <HelpSection>
            <SectionTitle>
              💡 Quick Tips
            </SectionTitle>
            <SectionContent>
              <ul>
                {contextualHelp.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </SectionContent>
          </HelpSection>
        </HelpSections>

        {llmConfig.enabled && (
          <AIHelpSection>
            <SectionTitle style={{ fontSize: '13px', marginBottom: '8px' }}>
              🤖 Ask AI Assistant
            </SectionTitle>
            <AIQuery>
              <QueryInput
                placeholder="Ask a specific question..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <QueryButton
                onClick={handleAIQuery}
                disabled={isLoadingAI || !customQuery.trim()}
              >
                {isLoadingAI ? '...' : 'Ask'}
              </QueryButton>
            </AIQuery>
            
            {isLoadingAI && (
              <LoadingIndicator>
                Thinking...
              </LoadingIndicator>
            )}
            
            {aiResponse && (
              <AIResponse>
                {aiResponse}
              </AIResponse>
            )}
          </AIHelpSection>
        )}
      </HelpContent>
    </HelpContainer>
  );
};