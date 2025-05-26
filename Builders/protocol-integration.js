/**
 * Protocol Integration and Validation System
 * Integrates chat protocol and logging protocol with the agent communication system
 */

const { ChatProtocol } = require('./chat-protocol');
const { LoggingProtocol } = require('./logging-protocol');
const { communicationHub } = require('./agent-communication');

class ProtocolIntegration {
  constructor() {
    this.chatProtocol = new ChatProtocol();
    this.loggingProtocol = new LoggingProtocol();
    this.validationEnabled = true;
    this.loggingEnabled = true;
    this.messageMiddleware = [];
    this.errorHandlers = new Map();
    
    this.initializeIntegration();
  }

  async initializeIntegration() {
    // Override the communication hub's message handling
    this.enhanceCommunicationHub();
    
    // Set up protocol validation
    this.setupValidation();
    
    // Initialize logging
    await this.loggingProtocol.initializeLogging();
    
    console.log('✅ Protocol integration initialized');
  }

  enhanceCommunicationHub() {
    // Store original methods
    const originalSendMessage = communicationHub.sendMessage.bind(communicationHub);
    const originalBroadcast = communicationHub.broadcast.bind(communicationHub);
    const originalRegisterAgent = communicationHub.registerAgent.bind(communicationHub);

    // Enhanced sendMessage with protocol validation and logging
    communicationHub.sendMessage = async (fromAgent, toAgent, content, messageType = 'DIRECT_MESSAGE') => {
      try {
        // Create standardized message
        const messageData = {
          from: fromAgent,
          to: toAgent,
          content: content,
          timestamp: Date.now()
        };

        if (messageType !== 'DIRECT_MESSAGE') {
          messageData.type = messageType;
        }

        // Validate message format
        let formattedMessage;
        if (this.validationEnabled) {
          formattedMessage = this.validateAndFormatMessage(messageType, messageData);
        } else {
          formattedMessage = this.chatProtocol.formatMessage(messageType, messageData);
        }

        // Apply middleware
        const processedMessage = await this.applyMiddleware(formattedMessage);

        // Log the message
        if (this.loggingEnabled) {
          await this.loggingProtocol.logMessage(processedMessage, {
            method: 'sendMessage',
            originalType: messageType
          });
        }

        // Call original method with processed message
        return originalSendMessage(fromAgent, toAgent, processedMessage.content, processedMessage.type);

      } catch (error) {
        await this.handleProtocolError('sendMessage', error, { fromAgent, toAgent, messageType });
        throw error;
      }
    };

    // Enhanced broadcast with protocol validation and logging
    communicationHub.broadcast = async (message) => {
      try {
        // Validate broadcast message
        let formattedMessage;
        if (this.validationEnabled) {
          formattedMessage = this.validateAndFormatMessage('BROADCAST', message);
        } else {
          formattedMessage = this.chatProtocol.formatMessage('BROADCAST', message);
        }

        // Apply middleware
        const processedMessage = await this.applyMiddleware(formattedMessage);

        // Log the broadcast
        if (this.loggingEnabled) {
          await this.loggingProtocol.logMessage(processedMessage, {
            method: 'broadcast',
            scope: message.scope || 'all'
          });
        }

        // Call original method
        return originalBroadcast(processedMessage);

      } catch (error) {
        await this.handleProtocolError('broadcast', error, { message });
        throw error;
      }
    };

    // Enhanced registerAgent with validation and logging
    communicationHub.registerAgent = async (agentId, capabilities, specializations) => {
      try {
        // Validate agent name format
        if (this.validationEnabled) {
          this.chatProtocol.validateAgentName(agentId);
        }

        // Log agent registration
        if (this.loggingEnabled) {
          await this.loggingProtocol.logMessage({
            id: this.chatProtocol.generateMessageId(),
            type: 'AGENT_REGISTRATION',
            from: 'SYSTEM',
            to: 'ALL',
            content: `Agent ${agentId} registered with capabilities: ${capabilities.join(', ')}`,
            timestamp: Date.now(),
            agentId: agentId,
            capabilities: capabilities,
            specializations: specializations
          }, {
            method: 'registerAgent'
          });
        }

        // Call original method
        return originalRegisterAgent(agentId, capabilities, specializations);

      } catch (error) {
        await this.handleProtocolError('registerAgent', error, { agentId, capabilities, specializations });
        throw error;
      }
    };
  }

  validateAndFormatMessage(messageType, messageData) {
    try {
      return this.chatProtocol.formatMessage(messageType, messageData);
    } catch (validationError) {
      throw new Error(`Message validation failed for type ${messageType}: ${validationError.message}`);
    }
  }

  setupValidation() {
    // Add custom validation rules
    this.addValidationRule('content_length', (message) => {
      if (typeof message.content === 'string' && message.content.length > 5000) {
        throw new Error('Message content exceeds maximum length of 5000 characters');
      }
    });

    this.addValidationRule('agent_exists', (message) => {
      // Check if agents exist in the system
      const registeredAgents = Array.from(communicationHub.agents.keys());
      if (message.from && !registeredAgents.includes(message.from) && message.from !== 'SYSTEM') {
        console.warn(`Warning: Sender agent ${message.from} not registered`);
      }
      if (message.to && !registeredAgents.includes(message.to) && message.to !== 'ALL') {
        console.warn(`Warning: Recipient agent ${message.to} not registered`);
      }
    });

    this.addValidationRule('urgency_consistency', (message) => {
      if (message.urgency === 'critical' && message.type === 'KNOWLEDGE_SHARE') {
        console.warn('Warning: Knowledge sharing marked as critical urgency - consider using different message type');
      }
    });
  }

  addValidationRule(name, validationFunction) {
    if (!this.validationRules) {
      this.validationRules = new Map();
    }
    this.validationRules.set(name, validationFunction);
  }

  async applyMiddleware(message) {
    let processedMessage = { ...message };
    
    for (const middleware of this.messageMiddleware) {
      try {
        processedMessage = await middleware(processedMessage);
      } catch (error) {
        console.error(`Middleware error: ${error.message}`);
      }
    }
    
    return processedMessage;
  }

  addMiddleware(middlewareFunction) {
    this.messageMiddleware.push(middlewareFunction);
  }

  // Built-in middleware functions
  createTimestampMiddleware() {
    return (message) => {
      if (!message.timestamp) {
        message.timestamp = Date.now();
      }
      return message;
    };
  }

  createRateLimitMiddleware(maxMessagesPerMinute = 60) {
    const rateLimits = new Map();
    
    return (message) => {
      const now = Date.now();
      const minute = Math.floor(now / 60000);
      const key = `${message.from}_${minute}`;
      
      const count = rateLimits.get(key) || 0;
      if (count >= maxMessagesPerMinute) {
        throw new Error(`Rate limit exceeded for agent ${message.from}`);
      }
      
      rateLimits.set(key, count + 1);
      
      // Clean up old entries
      for (const [k, v] of rateLimits.entries()) {
        const entryMinute = parseInt(k.split('_')[1]);
        if (minute - entryMinute > 5) { // Keep last 5 minutes
          rateLimits.delete(k);
        }
      }
      
      return message;
    };
  }

  createContentFilterMiddleware(bannedWords = []) {
    return (message) => {
      if (typeof message.content === 'string') {
        for (const word of bannedWords) {
          if (message.content.toLowerCase().includes(word.toLowerCase())) {
            console.warn(`Content filter triggered for word: ${word}`);
            message.flagged = true;
          }
        }
      }
      return message;
    };
  }

  createAnalyticsMiddleware() {
    return (message) => {
      // Add analytics tracking
      message.analytics = {
        processedAt: Date.now(),
        messageLength: typeof message.content === 'string' ? message.content.length : 0,
        hasAttachments: message.attachments && message.attachments.length > 0,
        isUrgent: message.urgency === 'high' || message.urgency === 'critical'
      };
      return message;
    };
  }

  async handleProtocolError(method, error, context) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      method: method,
      error: error.message,
      context: context,
      stack: error.stack
    };

    // Log error
    if (this.loggingEnabled) {
      await this.loggingProtocol.logMessage({
        id: this.chatProtocol.generateMessageId(),
        type: 'PROTOCOL_ERROR',
        from: 'PROTOCOL_SYSTEM',
        to: 'SYSTEM',
        content: `Protocol error in ${method}: ${error.message}`,
        timestamp: Date.now(),
        error: errorEntry
      }, {
        method: 'handleProtocolError'
      });
    }

    // Execute custom error handlers
    const handler = this.errorHandlers.get(method);
    if (handler) {
      try {
        await handler(error, context);
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError);
      }
    }
  }

  addErrorHandler(method, handler) {
    this.errorHandlers.set(method, handler);
  }

  // Protocol management methods
  enableValidation() {
    this.validationEnabled = true;
    console.log('✅ Protocol validation enabled');
  }

  disableValidation() {
    this.validationEnabled = false;
    console.log('⚠️ Protocol validation disabled');
  }

  enableLogging() {
    this.loggingEnabled = true;
    console.log('✅ Protocol logging enabled');
  }

  disableLogging() {
    this.loggingEnabled = false;
    console.log('⚠️ Protocol logging disabled');
  }

  async getProtocolStatus() {
    return {
      validation: this.validationEnabled,
      logging: this.loggingEnabled,
      middlewareCount: this.messageMiddleware.length,
      errorHandlerCount: this.errorHandlers.size,
      chatProtocolVersion: this.chatProtocol.protocolVersion,
      loggingSessionId: this.loggingProtocol.sessionId
    };
  }

  async generateProtocolReport() {
    const status = await this.getProtocolStatus();
    const networkAnalytics = await this.loggingProtocol.generateNetworkAnalytics('24h');
    
    return {
      protocol: status,
      network: networkAnalytics,
      documentation: this.chatProtocol.getProtocolDocumentation(),
      recommendations: this.generateRecommendations(networkAnalytics)
    };
  }

  generateRecommendations(analytics) {
    const recommendations = [];
    
    if (analytics.network.totalMessages > 1000) {
      recommendations.push('Consider implementing message archiving for performance');
    }
    
    if (analytics.network.activeAgents > 50) {
      recommendations.push('Consider implementing agent groups for better organization');
    }
    
    if (analytics.patterns.averageResponseTime > 300) {
      recommendations.push('Response times are high - consider optimizing message processing');
    }
    
    return recommendations;
  }

  // Conversation management
  async getConversationSummary(agentA, agentB) {
    return await this.loggingProtocol.getConversationHistory(agentA, agentB);
  }

  async replayConversation(conversationId, speed = 1.0) {
    return await this.loggingProtocol.createConversationReplay(conversationId, speed);
  }

  // Testing and debugging
  async testProtocol() {
    console.log('🧪 Testing protocol integration...');
    
    try {
      // Test message formatting
      const testMessage = this.chatProtocol.formatMessage('DIRECT_MESSAGE', {
        from: 'Test-Agent-001',
        to: 'Test-Recipient-001',
        content: 'This is a test message',
        urgency: 'medium'
      });
      
      console.log('✅ Message formatting test passed');
      
      // Test validation
      this.chatProtocol.validateAgentName('Test-Agent-001');
      console.log('✅ Agent name validation test passed');
      
      // Test logging
      await this.loggingProtocol.logMessage(testMessage, { method: 'test' });
      console.log('✅ Logging test passed');
      
      console.log('🎉 All protocol tests passed!');
      return true;
      
    } catch (error) {
      console.error('❌ Protocol test failed:', error.message);
      return false;
    }
  }
}

// Initialize the protocol integration
const protocolIntegration = new ProtocolIntegration();

// Add some default middleware
protocolIntegration.addMiddleware(protocolIntegration.createTimestampMiddleware());
protocolIntegration.addMiddleware(protocolIntegration.createAnalyticsMiddleware());
protocolIntegration.addMiddleware(protocolIntegration.createRateLimitMiddleware(100)); // 100 messages per minute

module.exports = {
  ProtocolIntegration,
  protocolIntegration
};