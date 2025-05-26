/**
 * Standardized Agent Chat Protocol
 * Defines message formats, conversation flows, and interaction patterns
 */

const fs = require('fs').promises;
const path = require('path');

class ChatProtocol {
  constructor() {
    this.messageFormats = new Map();
    this.conversationRules = new Map();
    this.validationRules = new Map();
    this.protocolVersion = '1.0.0';
    
    this.initializeProtocol();
  }

  initializeProtocol() {
    this.defineMessageFormats();
    this.defineConversationRules();
    this.defineValidationRules();
  }

  defineMessageFormats() {
    // Standard message types with required and optional fields
    this.messageFormats.set('DIRECT_MESSAGE', {
      required: ['from', 'to', 'content', 'timestamp'],
      optional: ['urgency', 'context', 'attachments', 'responseRequired'],
      schema: {
        from: 'string',
        to: 'string', 
        content: 'string',
        timestamp: 'number',
        urgency: 'enum:low,medium,high,critical',
        context: 'object',
        attachments: 'array',
        responseRequired: 'boolean'
      }
    });

    this.messageFormats.set('BROADCAST', {
      required: ['from', 'content', 'timestamp', 'scope'],
      optional: ['urgency', 'tags', 'excludeAgents'],
      schema: {
        from: 'string',
        content: 'string',
        timestamp: 'number',
        scope: 'enum:all,team,project,emergency',
        urgency: 'enum:low,medium,high,critical',
        tags: 'array',
        excludeAgents: 'array'
      }
    });

    this.messageFormats.set('COLLABORATION_REQUEST', {
      required: ['from', 'to', 'project', 'skillsNeeded', 'deadline', 'timestamp'],
      optional: ['priority', 'resources', 'expectedOutcome'],
      schema: {
        from: 'string',
        to: 'string',
        project: 'string',
        skillsNeeded: 'array',
        deadline: 'string',
        timestamp: 'number',
        priority: 'enum:low,medium,high,critical',
        resources: 'object',
        expectedOutcome: 'string'
      }
    });

    this.messageFormats.set('STATUS_UPDATE', {
      required: ['from', 'project', 'status', 'progress', 'timestamp'],
      optional: ['blockers', 'nextSteps', 'helpNeeded'],
      schema: {
        from: 'string',
        project: 'string',
        status: 'enum:starting,in_progress,blocked,completed,cancelled',
        progress: 'number',
        timestamp: 'number',
        blockers: 'array',
        nextSteps: 'array',
        helpNeeded: 'string'
      }
    });

    this.messageFormats.set('KNOWLEDGE_SHARE', {
      required: ['from', 'topic', 'content', 'timestamp'],
      optional: ['relevantAgents', 'references', 'difficulty'],
      schema: {
        from: 'string',
        topic: 'string',
        content: 'string',
        timestamp: 'number',
        relevantAgents: 'array',
        references: 'array',
        difficulty: 'enum:beginner,intermediate,advanced,expert'
      }
    });

    this.messageFormats.set('DECISION_REQUEST', {
      required: ['from', 'decision', 'options', 'deadline', 'timestamp'],
      optional: ['context', 'stakeholders', 'criteria'],
      schema: {
        from: 'string',
        decision: 'string',
        options: 'array',
        deadline: 'string',
        timestamp: 'number',
        context: 'string',
        stakeholders: 'array',
        criteria: 'array'
      }
    });

    this.messageFormats.set('PROTOCOL_ANNOUNCEMENT', {
      required: ['from', 'to', 'content', 'timestamp'],
      optional: ['urgency', 'context', 'features'],
      schema: {
        from: 'string',
        to: 'string',
        content: 'string',
        timestamp: 'number',
        urgency: 'enum:low,medium,high,critical',
        context: 'object',
        features: 'array'
      }
    });

    this.messageFormats.set('RAPID_INTEGRATION_REQUEST', {
      required: ['from', 'to', 'content', 'timestamp'],
      optional: ['urgency', 'timeline', 'requirements'],
      schema: {
        from: 'string',
        to: 'string',
        content: 'string',
        timestamp: 'number',
        urgency: 'enum:low,medium,high,critical',
        timeline: 'string',
        requirements: 'array'
      }
    });

    this.messageFormats.set('MAJOR_INFRASTRUCTURE_READY', {
      required: ['from', 'content', 'timestamp', 'scope'],
      optional: ['urgency', 'tags', 'capabilities'],
      schema: {
        from: 'string',
        content: 'string',
        timestamp: 'number',
        scope: 'enum:all,team,project,emergency',
        urgency: 'enum:low,medium,high,critical',
        tags: 'array',
        capabilities: 'array'
      }
    });
  }

  defineConversationRules() {
    // Rules for conversation flow and etiquette
    this.conversationRules.set('response_time', {
      CRITICAL: '< 5 minutes',
      HIGH: '< 30 minutes', 
      MEDIUM: '< 2 hours',
      LOW: '< 24 hours'
    });

    this.conversationRules.set('greeting_protocol', {
      first_contact: 'Include agent name and brief capability summary',
      ongoing: 'Use established agent identity',
      formal: 'Full agent designation and project context'
    });

    this.conversationRules.set('collaboration_flow', {
      initiation: ['COLLABORATION_REQUEST', 'project scope', 'expected timeline'],
      acceptance: ['acknowledge skills match', 'confirm availability', 'next steps'],
      execution: ['regular STATUS_UPDATE', 'KNOWLEDGE_SHARE as needed'],
      completion: ['final STATUS_UPDATE', 'lessons learned', 'future collaboration']
    });

    this.conversationRules.set('conflict_resolution', {
      disagreement: 'State position clearly, request mediation if needed',
      resource_conflict: 'Escalate to Orchestrator agent',
      technical_dispute: 'Provide evidence, seek technical review'
    });
  }

  defineValidationRules() {
    this.validationRules.set('agent_naming', {
      format: /^[A-Z][a-zA-Z0-9]*-[A-Z][a-zA-Z0-9]*-\d{3}$/,
      examples: ['Builder-Prime-001', 'Marketing-Strategist-001', 'Evolution-Prime-001'],
      description: 'Role-Specialty-Number format'
    });

    this.validationRules.set('message_length', {
      direct_message: { min: 10, max: 2000 },
      broadcast: { min: 20, max: 1000 },
      status_update: { min: 15, max: 500 }
    });

    this.validationRules.set('urgency_escalation', {
      low: 'routine information sharing',
      medium: 'coordination needed within timeframe',
      high: 'blocking issue or tight deadline',
      critical: 'system failure or emergency'
    });
  }

  formatMessage(type, data) {
    const format = this.messageFormats.get(type);
    if (!format) {
      throw new Error(`Unknown message type: ${type}`);
    }

    // Validate required fields
    for (const field of format.required) {
      if (!data.hasOwnProperty(field)) {
        throw new Error(`Missing required field: ${field} for message type: ${type}`);
      }
    }

    // Validate field types
    for (const [field, value] of Object.entries(data)) {
      if (format.schema[field]) {
        this.validateFieldType(field, value, format.schema[field]);
      }
    }

    // Create standardized message
    const message = {
      id: this.generateMessageId(),
      type: type,
      version: this.protocolVersion,
      ...data,
      timestamp: data.timestamp || Date.now()
    };

    return message;
  }

  validateFieldType(field, value, schema) {
    if (schema.startsWith('enum:')) {
      const validValues = schema.substring(5).split(',');
      if (!validValues.includes(value)) {
        throw new Error(`Invalid value for ${field}: ${value}. Must be one of: ${validValues.join(', ')}`);
      }
    } else if (schema === 'string' && typeof value !== 'string') {
      throw new Error(`Field ${field} must be a string`);
    } else if (schema === 'number' && typeof value !== 'number') {
      throw new Error(`Field ${field} must be a number`);
    } else if (schema === 'array' && !Array.isArray(value)) {
      throw new Error(`Field ${field} must be an array`);
    } else if (schema === 'object' && typeof value !== 'object') {
      throw new Error(`Field ${field} must be an object`);
    } else if (schema === 'boolean' && typeof value !== 'boolean') {
      throw new Error(`Field ${field} must be a boolean`);
    }
  }

  validateAgentName(agentName) {
    const rule = this.validationRules.get('agent_naming');
    if (!rule.format.test(agentName)) {
      throw new Error(`Invalid agent name format: ${agentName}. Must match: ${rule.description}`);
    }
    return true;
  }

  generateConversationTemplate(type) {
    const templates = {
      collaboration_initiation: {
        greeting: 'Hello [AGENT_NAME]! [YOUR_NAME] here.',
        purpose: 'I\'m reaching out about [PROJECT/TASK].',
        request: 'I need assistance with [SPECIFIC_SKILLS/AREAS].',
        timeline: 'Timeline: [DEADLINE/TIMEFRAME]',
        next_steps: 'Are you available to collaborate? What\'s your current capacity?'
      },
      
      status_report: {
        project: 'Project: [PROJECT_NAME]',
        progress: 'Progress: [PERCENTAGE]% complete',
        accomplishments: 'Recently completed: [ACHIEVEMENTS]',
        current_focus: 'Currently working on: [CURRENT_TASKS]',
        blockers: 'Blockers: [ISSUES] (if any)',
        next_steps: 'Next steps: [PLANNED_ACTIONS]',
        timeline: 'Expected completion: [DATE]'
      },

      knowledge_sharing: {
        topic: 'Knowledge Share: [TOPIC]',
        context: 'Context: [WHY_RELEVANT]',
        content: 'Key insights: [MAIN_POINTS]',
        application: 'Potential applications: [USE_CASES]',
        resources: 'Additional resources: [LINKS/REFERENCES]'
      },

      decision_request: {
        decision: 'Decision needed: [DECISION_TOPIC]',
        options: 'Options: [LIST_OPTIONS]',
        criteria: 'Decision criteria: [FACTORS]',
        impact: 'Impact: [CONSEQUENCES]',
        deadline: 'Decision deadline: [DATE]',
        stakeholders: 'Stakeholders: [AFFECTED_AGENTS]'
      }
    };

    return templates[type] || null;
  }

  createConversationStarter(fromAgent, purpose, urgency = 'medium') {
    return this.formatMessage('BROADCAST', {
      from: fromAgent,
      content: `${fromAgent} initiating new conversation thread: ${purpose}`,
      scope: 'all',
      urgency: urgency,
      tags: ['conversation_starter', purpose.toLowerCase().replace(/\s+/g, '_')]
    });
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getProtocolDocumentation() {
    return {
      version: this.protocolVersion,
      messageTypes: Array.from(this.messageFormats.keys()),
      conversationRules: Object.fromEntries(this.conversationRules),
      validationRules: Object.fromEntries(this.validationRules),
      templates: this.generateConversationTemplate,
      examples: this.getProtocolExamples()
    };
  }

  getProtocolExamples() {
    return {
      direct_message: this.formatMessage('DIRECT_MESSAGE', {
        from: 'Builder-Prime-001',
        to: 'Marketing-Strategist-001',
        content: 'Need your expertise on portfolio positioning strategy. Available for collaboration?',
        urgency: 'medium',
        responseRequired: true
      }),

      collaboration_request: this.formatMessage('COLLABORATION_REQUEST', {
        from: 'Orchestrator-Prime-001',
        to: 'Evolution-Prime-001',
        project: 'Adaptive Portfolio System',
        skillsNeeded: ['optimization algorithms', 'fitness evaluation', 'performance metrics'],
        deadline: '2025-06-01',
        priority: 'high',
        expectedOutcome: 'Optimized marketing strategy with measurable improvements'
      }),

      status_update: this.formatMessage('STATUS_UPDATE', {
        from: 'Builder-Prime-001',
        project: 'Agent Communication Protocol',
        status: 'in_progress',
        progress: 75,
        nextSteps: ['implement logging protocol', 'add message validation', 'create protocol documentation']
      }),

      broadcast: this.formatMessage('BROADCAST', {
        from: 'Marketing-Strategist-001',
        content: 'Completed market analysis for healthcare tech opportunities. Key findings available for review.',
        scope: 'all',
        urgency: 'low',
        tags: ['market_analysis', 'healthcare', 'opportunities']
      })
    };
  }
}

module.exports = {
  ChatProtocol
};