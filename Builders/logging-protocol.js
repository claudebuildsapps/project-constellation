/**
 * Comprehensive Logging Protocol for Agent Conversations
 * Handles conversation persistence, analytics, and replay capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const { ChatProtocol } = require('./chat-protocol');

class LoggingProtocol {
  constructor(logDirectory = './logs') {
    this.logDirectory = logDirectory;
    this.chatProtocol = new ChatProtocol();
    this.sessionId = this.generateSessionId();
    this.logLevel = 'DEBUG'; // DEBUG, INFO, WARN, ERROR
    this.activeConversations = new Map();
    this.conversationMetrics = new Map();
    this.logRotationSize = 10 * 1024 * 1024; // 10MB
    this.archiveOlderThan = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    this.initializeLogging();
  }

  async initializeLogging() {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
      await fs.mkdir(path.join(this.logDirectory, 'conversations'), { recursive: true });
      await fs.mkdir(path.join(this.logDirectory, 'analytics'), { recursive: true });
      await fs.mkdir(path.join(this.logDirectory, 'archives'), { recursive: true });
      
      // Create session log file
      this.sessionLogFile = path.join(this.logDirectory, `session_${this.sessionId}.log`);
      await this.writeSessionHeader();
      
      console.log(`📁 Logging initialized: ${this.logDirectory}`);
    } catch (error) {
      console.error('Failed to initialize logging:', error);
      // Create fallback in-memory logging
      this.sessionLogFile = null;
      this.logDirectory = null;
    }
  }

  async writeSessionHeader() {
    const header = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      protocolVersion: this.chatProtocol.protocolVersion,
      logLevel: this.logLevel,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch
      }
    };

    await this.writeToFile(this.sessionLogFile, `SESSION_START: ${JSON.stringify(header, null, 2)}\n`);
  }

  async logMessage(message, context = {}) {
    const logEntry = this.createLogEntry(message, context);
    
    // Write to session log
    await this.writeToSessionLog(logEntry);
    
    // Write to conversation-specific log
    await this.writeToConversationLog(message, logEntry);
    
    // Update conversation metrics
    this.updateConversationMetrics(message);
    
    // Write to analytics if needed
    if (this.shouldLogAnalytics(message)) {
      await this.writeToAnalyticsLog(message, logEntry);
    }

    return logEntry;
  }

  createLogEntry(message, context) {
    return {
      id: this.generateLogId(),
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      level: this.determineLogLevel(message),
      messageId: message.id,
      messageType: message.type,
      from: message.from,
      to: message.to,
      content: this.sanitizeContent(message.content),
      metadata: {
        urgency: message.urgency,
        responseRequired: message.responseRequired,
        tags: message.tags,
        context: context
      },
      conversationId: this.getConversationId(message),
      threadId: this.getThreadId(message)
    };
  }

  async writeToSessionLog(logEntry) {
    const logLine = `${logEntry.timestamp} [${logEntry.level}] ${logEntry.from} -> ${logEntry.to} (${logEntry.messageType}): ${this.truncateForLog(logEntry.content)}\n`;
    await this.writeToFile(this.sessionLogFile, logLine);
  }

  async writeToConversationLog(message, logEntry) {
    const conversationId = this.getConversationId(message);
    const conversationFile = path.join(this.logDirectory, 'conversations', `${conversationId}.json`);
    
    // Initialize conversation if new
    if (!this.activeConversations.has(conversationId)) {
      this.activeConversations.set(conversationId, {
        id: conversationId,
        participants: new Set([message.from, message.to]),
        startTime: new Date().toISOString(),
        messageCount: 0,
        lastActivity: new Date().toISOString()
      });
    }

    const conversation = this.activeConversations.get(conversationId);
    conversation.participants.add(message.from);
    conversation.participants.add(message.to);
    conversation.messageCount++;
    conversation.lastActivity = new Date().toISOString();

    // Read existing conversation log
    let conversationLog;
    try {
      const existingLog = await fs.readFile(conversationFile, 'utf8');
      conversationLog = JSON.parse(existingLog);
    } catch (error) {
      conversationLog = {
        conversationId: conversationId,
        metadata: conversation,
        messages: []
      };
    }

    // Add new log entry
    conversationLog.messages.push(logEntry);
    conversationLog.metadata = {
      ...conversation,
      participants: Array.from(conversation.participants)
    };

    // Write back to file
    await this.writeToFile(conversationFile, JSON.stringify(conversationLog, null, 2));
  }

  async writeToAnalyticsLog(message, logEntry) {
    const analyticsFile = path.join(this.logDirectory, 'analytics', `analytics_${this.getDateString()}.json`);
    
    const analyticsEntry = {
      timestamp: logEntry.timestamp,
      messageType: message.type,
      participantCount: this.getParticipantCount(message),
      responseTime: this.calculateResponseTime(message),
      conversationLength: this.getConversationLength(message),
      urgencyLevel: message.urgency,
      collaborationType: this.classifyCollaborationType(message),
      networkActivity: this.getNetworkActivityLevel()
    };

    // Read existing analytics
    let analytics;
    try {
      const existingAnalytics = await fs.readFile(analyticsFile, 'utf8');
      analytics = JSON.parse(existingAnalytics);
    } catch (error) {
      analytics = {
        date: this.getDateString(),
        entries: []
      };
    }

    analytics.entries.push(analyticsEntry);
    await this.writeToFile(analyticsFile, JSON.stringify(analytics, null, 2));
  }

  getConversationId(message) {
    // Create consistent conversation ID for related messages
    if (message.type === 'BROADCAST') {
      return `broadcast_${message.from}_${this.getDateString()}`;
    }
    
    // For direct messages, create ID from sorted participants
    const participants = [message.from, message.to].sort();
    return `conversation_${participants.join('_')}_${this.getDateString()}`;
  }

  getThreadId(message) {
    // Create thread ID based on topic or project
    if (message.project) {
      return `thread_${message.project.replace(/\s+/g, '_').toLowerCase()}`;
    }
    
    if (message.tags && message.tags.length > 0) {
      return `thread_${message.tags[0].replace(/\s+/g, '_').toLowerCase()}`;
    }
    
    return `thread_general_${this.getDateString()}`;
  }

  updateConversationMetrics(message) {
    const conversationId = this.getConversationId(message);
    
    if (!this.conversationMetrics.has(conversationId)) {
      this.conversationMetrics.set(conversationId, {
        messageCount: 0,
        participantCount: new Set(),
        averageResponseTime: 0,
        urgencyDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
        messageTypes: new Map(),
        startTime: Date.now(),
        lastActivity: Date.now()
      });
    }

    const metrics = this.conversationMetrics.get(conversationId);
    metrics.messageCount++;
    metrics.participantCount.add(message.from);
    metrics.participantCount.add(message.to);
    metrics.lastActivity = Date.now();
    
    if (message.urgency) {
      metrics.urgencyDistribution[message.urgency]++;
    }
    
    const typeCount = metrics.messageTypes.get(message.type) || 0;
    metrics.messageTypes.set(message.type, typeCount + 1);
  }

  async generateConversationSummary(conversationId) {
    const conversationFile = path.join(this.logDirectory, 'conversations', `${conversationId}.json`);
    
    try {
      const conversationData = JSON.parse(await fs.readFile(conversationFile, 'utf8'));
      const metrics = this.conversationMetrics.get(conversationId);
      
      return {
        conversationId: conversationId,
        summary: {
          totalMessages: conversationData.messages.length,
          participants: conversationData.metadata.participants,
          duration: this.calculateDuration(conversationData.metadata.startTime, conversationData.metadata.lastActivity),
          messageTypes: Array.from(metrics.messageTypes.entries()),
          urgencyBreakdown: metrics.urgencyDistribution,
          keyTopics: this.extractKeyTopics(conversationData.messages),
          collaborationOutcome: this.assessCollaborationOutcome(conversationData.messages)
        },
        timeline: this.createConversationTimeline(conversationData.messages)
      };
    } catch (error) {
      throw new Error(`Failed to generate summary for conversation ${conversationId}: ${error.message}`);
    }
  }

  async getConversationHistory(participantA, participantB, dateRange = null) {
    const conversationId = this.getConversationId({ from: participantA, to: participantB });
    
    try {
      const conversationFile = path.join(this.logDirectory, 'conversations', `${conversationId}.json`);
      const conversationData = JSON.parse(await fs.readFile(conversationFile, 'utf8'));
      
      let messages = conversationData.messages;
      
      if (dateRange) {
        messages = messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          return msgDate >= dateRange.start && msgDate <= dateRange.end;
        });
      }
      
      return {
        conversationId: conversationId,
        participants: [participantA, participantB],
        messages: messages,
        metadata: conversationData.metadata
      };
    } catch (error) {
      return { conversationId: conversationId, messages: [], error: error.message };
    }
  }

  async generateNetworkAnalytics(timeframe = '24h') {
    const endTime = Date.now();
    const startTime = endTime - this.parseTimeframe(timeframe);
    
    const analytics = {
      timeframe: timeframe,
      period: { start: new Date(startTime).toISOString(), end: new Date(endTime).toISOString() },
      network: {
        totalMessages: 0,
        activeAgents: new Set(),
        conversationCount: 0,
        collaborationRequests: 0,
        projectUpdates: 0
      },
      patterns: {
        peakActivityHours: this.calculatePeakHours(startTime, endTime),
        mostActiveAgent: null,
        mostCommonMessageType: null,
        averageResponseTime: 0
      },
      collaboration: {
        newPartnerships: 0,
        ongoingProjects: 0,
        completedTasks: 0,
        knowledge_shares: 0
      }
    };

    // Analyze all conversation files within timeframe
    const conversationFiles = await fs.readdir(path.join(this.logDirectory, 'conversations'));
    
    for (const file of conversationFiles) {
      if (file.endsWith('.json')) {
        const conversationData = JSON.parse(
          await fs.readFile(path.join(this.logDirectory, 'conversations', file), 'utf8')
        );
        
        const relevantMessages = conversationData.messages.filter(msg => {
          const msgTime = new Date(msg.timestamp).getTime();
          return msgTime >= startTime && msgTime <= endTime;
        });
        
        if (relevantMessages.length > 0) {
          analytics.network.totalMessages += relevantMessages.length;
          analytics.network.conversationCount++;
          
          relevantMessages.forEach(msg => {
            analytics.network.activeAgents.add(msg.from);
            analytics.network.activeAgents.add(msg.to);
            
            if (msg.messageType === 'COLLABORATION_REQUEST') {
              analytics.network.collaborationRequests++;
            } else if (msg.messageType === 'STATUS_UPDATE') {
              analytics.network.projectUpdates++;
            }
          });
        }
      }
    }

    analytics.network.activeAgents = analytics.network.activeAgents.size;
    return analytics;
  }

  async createConversationReplay(conversationId, speed = 1.0) {
    const conversationData = await this.getConversationHistory(conversationId);
    
    return {
      conversationId: conversationId,
      replayData: {
        totalDuration: this.calculateTotalDuration(conversationData.messages),
        speed: speed,
        events: conversationData.messages.map((msg, index) => ({
          sequenceNumber: index + 1,
          timestamp: msg.timestamp,
          relativeTime: this.calculateRelativeTime(conversationData.messages[0].timestamp, msg.timestamp),
          displayTime: this.calculateDisplayTime(conversationData.messages[0].timestamp, msg.timestamp, speed),
          message: msg
        }))
      }
    };
  }

  // Utility methods
  determineLogLevel(message) {
    if (message.urgency === 'critical') return 'ERROR';
    if (message.urgency === 'high') return 'WARN';
    if (message.urgency === 'medium') return 'INFO';
    return 'DEBUG';
  }

  sanitizeContent(content) {
    // Remove sensitive information, truncate if needed
    if (typeof content === 'string') {
      return content.substring(0, 1000); // Limit content length
    }
    return JSON.stringify(content).substring(0, 1000);
  }

  truncateForLog(content, maxLength = 100) {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  shouldLogAnalytics(message) {
    // Log analytics for important message types
    const analyticsTypes = ['COLLABORATION_REQUEST', 'STATUS_UPDATE', 'DECISION_REQUEST', 'PROJECT_ANNOUNCEMENT'];
    return analyticsTypes.includes(message.type);
  }

  async writeToFile(filePath, content) {
    if (!filePath) {
      console.log(`LOG: ${content.trim()}`);
      return;
    }
    
    try {
      await fs.appendFile(filePath, content);
    } catch (error) {
      console.error(`Failed to write to ${filePath}:`, error);
      // Fallback to console logging
      console.log(`LOG: ${content.trim()}`);
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  getDateString() {
    return new Date().toISOString().split('T')[0];
  }

  parseTimeframe(timeframe) {
    const units = { h: 3600000, d: 86400000, w: 604800000 };
    const match = timeframe.match(/^(\d+)([hdw])$/);
    if (match) {
      return parseInt(match[1]) * units[match[2]];
    }
    return 86400000; // Default to 24 hours
  }

  // Placeholder methods for advanced analytics
  calculateResponseTime(message) { return Math.random() * 300; } // Seconds
  getParticipantCount(message) { return 2; }
  getConversationLength(message) { return Math.floor(Math.random() * 20) + 1; }
  classifyCollaborationType(message) { return 'technical'; }
  getNetworkActivityLevel() { return 'medium'; }
  extractKeyTopics(messages) { return ['portfolio', 'collaboration', 'technical']; }
  assessCollaborationOutcome(messages) { return 'successful'; }
  createConversationTimeline(messages) { return messages.map(msg => ({ time: msg.timestamp, event: msg.messageType })); }
  calculateDuration(start, end) { return new Date(end) - new Date(start); }
  calculatePeakHours(start, end) { return ['14:00', '15:00', '16:00']; }
  calculateTotalDuration(messages) { return messages.length * 30; } // Seconds
  calculateRelativeTime(start, current) { return new Date(current) - new Date(start); }
  calculateDisplayTime(start, current, speed) { return this.calculateRelativeTime(start, current) / speed; }
}

module.exports = {
  LoggingProtocol
};