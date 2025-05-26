/**
 * Conversation Manager - Persistence and Replay System
 * Handles conversation storage, retrieval, and replay functionality
 */

const fs = require('fs').promises;
const path = require('path');
const { LoggingProtocol } = require('./logging-protocol');
const { ChatProtocol } = require('./chat-protocol');

class ConversationManager {
  constructor(dataDirectory = './conversation-data') {
    this.dataDirectory = dataDirectory;
    this.loggingProtocol = new LoggingProtocol();
    this.chatProtocol = new ChatProtocol();
    this.activeReplays = new Map();
    this.conversationIndex = new Map();
    this.searchIndex = new Map();
    
    this.initializeManager();
  }

  async initializeManager() {
    try {
      await fs.mkdir(this.dataDirectory, { recursive: true });
      await fs.mkdir(path.join(this.dataDirectory, 'conversations'), { recursive: true });
      await fs.mkdir(path.join(this.dataDirectory, 'replays'), { recursive: true });
      await fs.mkdir(path.join(this.dataDirectory, 'exports'), { recursive: true });
      await fs.mkdir(path.join(this.dataDirectory, 'analytics'), { recursive: true });
      
      // Load existing conversation index
      await this.loadConversationIndex();
      
      console.log('📚 Conversation Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Conversation Manager:', error);
    }
  }

  async saveConversation(conversationId, messages, metadata = {}) {
    const conversation = {
      id: conversationId,
      metadata: {
        created: new Date().toISOString(),
        participants: this.extractParticipants(messages),
        messageCount: messages.length,
        duration: this.calculateDuration(messages),
        tags: metadata.tags || [],
        project: metadata.project || null,
        ...metadata
      },
      messages: messages.map(msg => ({
        ...msg,
        saved: new Date().toISOString()
      }))
    };

    const conversationFile = path.join(this.dataDirectory, 'conversations', `${conversationId}.json`);
    await fs.writeFile(conversationFile, JSON.stringify(conversation, null, 2));
    
    // Update index
    this.conversationIndex.set(conversationId, {
      file: conversationFile,
      metadata: conversation.metadata
    });
    
    await this.saveConversationIndex();
    await this.updateSearchIndex(conversation);
    
    console.log(`💾 Conversation ${conversationId} saved with ${messages.length} messages`);
    return conversationId;
  }

  async loadConversation(conversationId) {
    try {
      const conversationFile = path.join(this.dataDirectory, 'conversations', `${conversationId}.json`);
      const data = await fs.readFile(conversationFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Conversation ${conversationId} not found: ${error.message}`);
    }
  }

  async searchConversations(query, filters = {}) {
    const results = [];
    
    for (const [conversationId, indexData] of this.conversationIndex.entries()) {
      try {
        const conversation = await this.loadConversation(conversationId);
        
        // Apply filters
        if (filters.participants && !this.matchesParticipants(conversation, filters.participants)) {
          continue;
        }
        
        if (filters.dateRange && !this.matchesDateRange(conversation, filters.dateRange)) {
          continue;
        }
        
        if (filters.project && conversation.metadata.project !== filters.project) {
          continue;
        }
        
        if (filters.tags && !this.matchesTags(conversation, filters.tags)) {
          continue;
        }
        
        // Text search in messages
        const relevanceScore = this.calculateRelevance(conversation, query);
        if (relevanceScore > 0) {
          results.push({
            conversationId: conversationId,
            relevanceScore: relevanceScore,
            metadata: conversation.metadata,
            matchingMessages: this.findMatchingMessages(conversation.messages, query)
          });
        }
      } catch (error) {
        console.warn(`Error searching conversation ${conversationId}:`, error.message);
      }
    }
    
    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async createReplay(conversationId, options = {}) {
    const conversation = await this.loadConversation(conversationId);
    const replayId = `replay_${conversationId}_${Date.now()}`;
    
    const replay = {
      id: replayId,
      conversationId: conversationId,
      created: new Date().toISOString(),
      options: {
        speed: options.speed || 1.0,
        skipPauses: options.skipPauses || false,
        highlightKeywords: options.highlightKeywords || [],
        filterMessageTypes: options.filterMessageTypes || [],
        startTime: options.startTime || null,
        endTime: options.endTime || null,
        ...options
      },
      events: this.createReplayEvents(conversation.messages, options),
      metadata: {
        originalDuration: this.calculateDuration(conversation.messages),
        replayDuration: this.calculateReplayDuration(conversation.messages, options),
        messageCount: conversation.messages.length,
        filteredMessageCount: this.countFilteredMessages(conversation.messages, options)
      }
    };

    // Save replay configuration
    const replayFile = path.join(this.dataDirectory, 'replays', `${replayId}.json`);
    await fs.writeFile(replayFile, JSON.stringify(replay, null, 2));
    
    this.activeReplays.set(replayId, replay);
    
    console.log(`🎬 Replay ${replayId} created for conversation ${conversationId}`);
    return replay;
  }

  createReplayEvents(messages, options) {
    let filteredMessages = messages;
    
    // Apply time range filter
    if (options.startTime || options.endTime) {
      filteredMessages = messages.filter(msg => {
        const msgTime = new Date(msg.timestamp);
        const start = options.startTime ? new Date(options.startTime) : new Date(0);
        const end = options.endTime ? new Date(options.endTime) : new Date();
        return msgTime >= start && msgTime <= end;
      });
    }
    
    // Apply message type filter
    if (options.filterMessageTypes && options.filterMessageTypes.length > 0) {
      filteredMessages = filteredMessages.filter(msg => 
        options.filterMessageTypes.includes(msg.type)
      );
    }
    
    // Create replay events
    const events = [];
    let replayTime = 0;
    
    for (let i = 0; i < filteredMessages.length; i++) {
      const message = filteredMessages[i];
      const nextMessage = filteredMessages[i + 1];
      
      // Calculate timing
      if (i === 0) {
        replayTime = 0;
      } else {
        const originalDelay = new Date(message.timestamp) - new Date(filteredMessages[i - 1].timestamp);
        let adjustedDelay = originalDelay / (options.speed || 1.0);
        
        if (options.skipPauses && adjustedDelay > 30000) { // Skip pauses > 30 seconds
          adjustedDelay = 1000; // Replace with 1 second
        }
        
        replayTime += adjustedDelay;
      }
      
      events.push({
        id: `event_${i + 1}`,
        replayTime: replayTime,
        originalTime: message.timestamp,
        message: message,
        highlighted: this.shouldHighlight(message, options.highlightKeywords),
        eventType: this.classifyEventType(message, filteredMessages[i - 1])
      });
    }
    
    return events;
  }

  async startReplay(replayId, onEvent, onComplete) {
    const replay = this.activeReplays.get(replayId);
    if (!replay) {
      throw new Error(`Replay ${replayId} not found`);
    }
    
    console.log(`▶️ Starting replay ${replayId} with ${replay.events.length} events`);
    
    let eventIndex = 0;
    const startTime = Date.now();
    
    const processNextEvent = () => {
      if (eventIndex >= replay.events.length) {
        onComplete && onComplete(replay);
        return;
      }
      
      const event = replay.events[eventIndex];
      const elapsed = Date.now() - startTime;
      const targetTime = event.replayTime;
      
      if (elapsed >= targetTime) {
        onEvent && onEvent(event, eventIndex, replay.events.length);
        eventIndex++;
        setImmediate(processNextEvent);
      } else {
        setTimeout(processNextEvent, Math.min(100, targetTime - elapsed));
      }
    };
    
    processNextEvent();
  }

  async exportConversation(conversationId, format = 'json', options = {}) {
    const conversation = await this.loadConversation(conversationId);
    const exportId = `export_${conversationId}_${Date.now()}`;
    
    let exportData;
    let filename;
    
    switch (format.toLowerCase()) {
      case 'json':
        exportData = JSON.stringify(conversation, null, 2);
        filename = `${exportId}.json`;
        break;
        
      case 'csv':
        exportData = this.convertToCSV(conversation);
        filename = `${exportId}.csv`;
        break;
        
      case 'txt':
        exportData = this.convertToText(conversation, options);
        filename = `${exportId}.txt`;
        break;
        
      case 'html':
        exportData = this.convertToHTML(conversation, options);
        filename = `${exportId}.html`;
        break;
        
      case 'markdown':
        exportData = this.convertToMarkdown(conversation, options);
        filename = `${exportId}.md`;
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    const exportFile = path.join(this.dataDirectory, 'exports', filename);
    await fs.writeFile(exportFile, exportData);
    
    console.log(`📤 Conversation ${conversationId} exported as ${format} to ${filename}`);
    return {
      exportId: exportId,
      filename: filename,
      path: exportFile,
      format: format,
      size: Buffer.byteLength(exportData, 'utf8')
    };
  }

  convertToCSV(conversation) {
    const headers = ['Timestamp', 'From', 'To', 'Type', 'Content', 'Urgency'];
    const rows = [headers.join(',')];
    
    for (const message of conversation.messages) {
      const row = [
        new Date(message.timestamp).toISOString(),
        message.from,
        message.to || 'ALL',
        message.type,
        `"${(message.content || '').replace(/"/g, '""')}"`,
        message.urgency || ''
      ];
      rows.push(row.join(','));
    }
    
    return rows.join('\n');
  }

  convertToText(conversation, options = {}) {
    const lines = [];
    lines.push(`Conversation: ${conversation.id}`);
    lines.push(`Participants: ${conversation.metadata.participants.join(', ')}`);
    lines.push(`Duration: ${conversation.metadata.duration}`);
    lines.push(`Messages: ${conversation.metadata.messageCount}`);
    lines.push('=' * 50);
    lines.push('');
    
    for (const message of conversation.messages) {
      const timestamp = new Date(message.timestamp).toLocaleString();
      lines.push(`[${timestamp}] ${message.from} -> ${message.to || 'ALL'}`);
      if (message.type !== 'DIRECT_MESSAGE') {
        lines.push(`Type: ${message.type}`);
      }
      if (message.urgency) {
        lines.push(`Urgency: ${message.urgency}`);
      }
      lines.push(`Content: ${message.content}`);
      lines.push('');
    }
    
    return lines.join('\n');
  }

  convertToHTML(conversation, options = {}) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Conversation: ${conversation.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
        .message { border-left: 3px solid #007cba; padding: 10px; margin: 10px 0; }
        .timestamp { color: #666; font-size: 0.9em; }
        .from { font-weight: bold; color: #007cba; }
        .content { margin-top: 5px; }
        .type { font-style: italic; color: #666; }
        .urgent { border-left-color: #ff4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Conversation: ${conversation.id}</h1>
        <p>Participants: ${conversation.metadata.participants.join(', ')}</p>
        <p>Messages: ${conversation.metadata.messageCount} | Duration: ${conversation.metadata.duration}</p>
    </div>
    
    ${conversation.messages.map(message => `
        <div class="message ${message.urgency === 'critical' || message.urgency === 'high' ? 'urgent' : ''}">
            <div class="timestamp">${new Date(message.timestamp).toLocaleString()}</div>
            <div class="from">${message.from} → ${message.to || 'ALL'}</div>
            ${message.type !== 'DIRECT_MESSAGE' ? `<div class="type">${message.type}</div>` : ''}
            <div class="content">${this.escapeHtml(message.content)}</div>
        </div>
    `).join('')}
</body>
</html>`;
    
    return html;
  }

  convertToMarkdown(conversation, options = {}) {
    const lines = [];
    lines.push(`# Conversation: ${conversation.id}`);
    lines.push('');
    lines.push(`**Participants:** ${conversation.metadata.participants.join(', ')}`);
    lines.push(`**Messages:** ${conversation.metadata.messageCount}`);
    lines.push(`**Duration:** ${conversation.metadata.duration}`);
    lines.push('');
    lines.push('---');
    lines.push('');
    
    for (const message of conversation.messages) {
      const timestamp = new Date(message.timestamp).toLocaleString();
      lines.push(`## ${message.from} → ${message.to || 'ALL'}`);
      lines.push(`*${timestamp}*`);
      if (message.type !== 'DIRECT_MESSAGE') {
        lines.push(`**Type:** ${message.type}`);
      }
      if (message.urgency) {
        lines.push(`**Urgency:** ${message.urgency}`);
      }
      lines.push('');
      lines.push(message.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
    
    return lines.join('\n');
  }

  async generateAnalytics(conversationId) {
    const conversation = await this.loadConversation(conversationId);
    
    const analytics = {
      conversationId: conversationId,
      overview: {
        totalMessages: conversation.messages.length,
        uniqueParticipants: conversation.metadata.participants.length,
        timespan: conversation.metadata.duration,
        averageMessageLength: this.calculateAverageMessageLength(conversation.messages),
        messageFrequency: this.calculateMessageFrequency(conversation.messages)
      },
      participation: this.analyzeParticipation(conversation.messages),
      messageTypes: this.analyzeMessageTypes(conversation.messages),
      urgencyDistribution: this.analyzeUrgency(conversation.messages),
      timeline: this.createTimeline(conversation.messages),
      keyTopics: this.extractKeyTopics(conversation.messages),
      collaborationMetrics: this.calculateCollaborationMetrics(conversation.messages)
    };
    
    // Save analytics
    const analyticsFile = path.join(this.dataDirectory, 'analytics', `${conversationId}_analytics.json`);
    await fs.writeFile(analyticsFile, JSON.stringify(analytics, null, 2));
    
    return analytics;
  }

  // Utility methods
  extractParticipants(messages) {
    const participants = new Set();
    messages.forEach(msg => {
      participants.add(msg.from);
      if (msg.to && msg.to !== 'ALL') {
        participants.add(msg.to);
      }
    });
    return Array.from(participants);
  }

  calculateDuration(messages) {
    if (messages.length < 2) return '0 minutes';
    
    const start = new Date(messages[0].timestamp);
    const end = new Date(messages[messages.length - 1].timestamp);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }

  calculateRelevance(conversation, query) {
    if (!query) return 1;
    
    const queryLower = query.toLowerCase();
    let score = 0;
    
    // Search in metadata
    if (conversation.metadata.project && conversation.metadata.project.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    conversation.metadata.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 5;
      }
    });
    
    // Search in messages
    conversation.messages.forEach(msg => {
      if (msg.content && msg.content.toLowerCase().includes(queryLower)) {
        score += 1;
      }
    });
    
    return score;
  }

  findMatchingMessages(messages, query) {
    if (!query) return [];
    
    const queryLower = query.toLowerCase();
    return messages
      .filter(msg => msg.content && msg.content.toLowerCase().includes(queryLower))
      .map(msg => ({
        id: msg.id,
        from: msg.from,
        timestamp: msg.timestamp,
        snippet: this.createSnippet(msg.content, query)
      }));
  }

  createSnippet(text, query, maxLength = 100) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) return text.substring(0, maxLength) + '...';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + query.length + 30);
    const snippet = text.substring(start, end);
    
    return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
  }

  shouldHighlight(message, keywords) {
    if (!keywords || keywords.length === 0) return false;
    
    const content = (message.content || '').toLowerCase();
    return keywords.some(keyword => content.includes(keyword.toLowerCase()));
  }

  classifyEventType(message, previousMessage) {
    if (!previousMessage) return 'conversation_start';
    if (message.type === 'COLLABORATION_REQUEST') return 'collaboration_request';
    if (message.urgency === 'critical') return 'urgent_message';
    if (message.from !== previousMessage.from) return 'speaker_change';
    return 'regular_message';
  }

  escapeHtml(text) {
    const div = { innerHTML: '' };
    div.textContent = text;
    return div.innerHTML;
  }

  // Placeholder analytics methods
  calculateAverageMessageLength(messages) {
    const totalLength = messages.reduce((sum, msg) => sum + (msg.content || '').length, 0);
    return Math.round(totalLength / messages.length);
  }

  calculateMessageFrequency(messages) {
    if (messages.length < 2) return 0;
    const duration = new Date(messages[messages.length - 1].timestamp) - new Date(messages[0].timestamp);
    return Math.round((messages.length / duration) * 60000); // Messages per minute
  }

  analyzeParticipation(messages) {
    const participation = {};
    messages.forEach(msg => {
      participation[msg.from] = (participation[msg.from] || 0) + 1;
    });
    return participation;
  }

  analyzeMessageTypes(messages) {
    const types = {};
    messages.forEach(msg => {
      types[msg.type] = (types[msg.type] || 0) + 1;
    });
    return types;
  }

  analyzeUrgency(messages) {
    const urgency = { low: 0, medium: 0, high: 0, critical: 0 };
    messages.forEach(msg => {
      urgency[msg.urgency || 'medium']++;
    });
    return urgency;
  }

  createTimeline(messages) {
    return messages.map(msg => ({
      timestamp: msg.timestamp,
      from: msg.from,
      type: msg.type,
      urgency: msg.urgency
    }));
  }

  extractKeyTopics(messages) {
    // Simple keyword extraction
    const words = {};
    messages.forEach(msg => {
      if (msg.content) {
        const contentWords = msg.content.toLowerCase().match(/\b\w{4,}\b/g) || [];
        contentWords.forEach(word => {
          words[word] = (words[word] || 0) + 1;
        });
      }
    });
    
    return Object.entries(words)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }

  calculateCollaborationMetrics(messages) {
    return {
      responseRate: this.calculateResponseRate(messages),
      averageResponseTime: this.calculateAverageResponseTime(messages),
      collaborationIntensity: this.calculateCollaborationIntensity(messages)
    };
  }

  calculateResponseRate(messages) { return 0.85; } // Placeholder
  calculateAverageResponseTime(messages) { return 120; } // Placeholder seconds
  calculateCollaborationIntensity(messages) { return 'high'; } // Placeholder

  // Index management
  async loadConversationIndex() {
    try {
      const indexFile = path.join(this.dataDirectory, 'conversation_index.json');
      const data = await fs.readFile(indexFile, 'utf8');
      const indexData = JSON.parse(data);
      this.conversationIndex = new Map(indexData);
    } catch (error) {
      // Index doesn't exist yet, start fresh
      this.conversationIndex = new Map();
    }
  }

  async saveConversationIndex() {
    const indexFile = path.join(this.dataDirectory, 'conversation_index.json');
    const indexData = Array.from(this.conversationIndex.entries());
    await fs.writeFile(indexFile, JSON.stringify(indexData, null, 2));
  }

  async updateSearchIndex(conversation) {
    // Simple search index update
    const words = this.extractKeyTopics(conversation.messages);
    words.forEach(({ word }) => {
      if (!this.searchIndex.has(word)) {
        this.searchIndex.set(word, new Set());
      }
      this.searchIndex.get(word).add(conversation.id);
    });
  }

  // Filter helper methods
  matchesParticipants(conversation, participants) {
    return participants.every(p => conversation.metadata.participants.includes(p));
  }

  matchesDateRange(conversation, dateRange) {
    const conversationDate = new Date(conversation.metadata.created);
    return conversationDate >= dateRange.start && conversationDate <= dateRange.end;
  }

  matchesTags(conversation, tags) {
    return tags.some(tag => conversation.metadata.tags.includes(tag));
  }

  countFilteredMessages(messages, options) {
    return this.createReplayEvents(messages, options).length;
  }

  calculateReplayDuration(messages, options) {
    const events = this.createReplayEvents(messages, options);
    return events.length > 0 ? events[events.length - 1].replayTime : 0;
  }
}

module.exports = {
  ConversationManager
};