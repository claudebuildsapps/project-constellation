/**
 * Conversation Tracker for Multi-Agent Collaboration
 * Tracks and analyzes agent conversations for Project Constellation
 */

class ConversationTracker {
  constructor() {
    this.conversations = [];
    this.agentMetrics = new Map();
    this.topicAnalysis = new Map();
    this.collaborationPatterns = [];
    this.conversationLog = [];
    this.activeThreads = new Map();
  }

  logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      from: message.from,
      to: message.to,
      type: message.type,
      content: message.content,
      id: message.id,
      threadId: this.getOrCreateThread(message.from, message.to)
    };

    this.conversationLog.push(logEntry);
    this.updateAgentMetrics(message);
    this.analyzeTopics(message);
    this.trackCollaborationPatterns(message);

    // Real-time conversation display
    this.displayConversation(logEntry);
    
    return logEntry;
  }

  getOrCreateThread(agent1, agent2) {
    const threadKey = [agent1, agent2].sort().join('-');
    if (!this.activeThreads.has(threadKey)) {
      this.activeThreads.set(threadKey, {
        id: threadKey,
        participants: [agent1, agent2],
        messageCount: 0,
        topics: new Set(),
        startTime: Date.now(),
        lastActivity: Date.now()
      });
    }
    
    const thread = this.activeThreads.get(threadKey);
    thread.messageCount++;
    thread.lastActivity = Date.now();
    
    return threadKey;
  }

  updateAgentMetrics(message) {
    if (!this.agentMetrics.has(message.from)) {
      this.agentMetrics.set(message.from, {
        messagesSent: 0,
        messagesReceived: 0,
        collaborations: new Set(),
        topics: new Set(),
        avgResponseTime: 0,
        lastActivity: Date.now()
      });
    }

    if (!this.agentMetrics.has(message.to)) {
      this.agentMetrics.set(message.to, {
        messagesSent: 0,
        messagesReceived: 0,
        collaborations: new Set(),
        topics: new Set(),
        avgResponseTime: 0,
        lastActivity: Date.now()
      });
    }

    const senderMetrics = this.agentMetrics.get(message.from);
    const receiverMetrics = this.agentMetrics.get(message.to);

    senderMetrics.messagesSent++;
    senderMetrics.collaborations.add(message.to);
    senderMetrics.lastActivity = Date.now();

    receiverMetrics.messagesReceived++;
    receiverMetrics.collaborations.add(message.from);
  }

  analyzeTopics(message) {
    const topics = this.extractTopics(message.content);
    
    topics.forEach(topic => {
      if (!this.topicAnalysis.has(topic)) {
        this.topicAnalysis.set(topic, {
          mentions: 0,
          agents: new Set(),
          conversations: new Set(),
          firstMention: Date.now(),
          lastMention: Date.now()
        });
      }

      const topicData = this.topicAnalysis.get(topic);
      topicData.mentions++;
      topicData.agents.add(message.from);
      topicData.conversations.add(this.getOrCreateThread(message.from, message.to));
      topicData.lastMention = Date.now();
    });
  }

  extractTopics(content) {
    const technicalKeywords = [
      'architecture', 'API', 'microservices', 'performance', 'scalability',
      'intelligence', 'adaptive', 'real-time', 'prototype', 'coordination',
      'integration', 'platform', 'framework', 'pipeline', 'optimization',
      'behavioral', 'biometrics', 'analysis', 'sprint', 'collaboration',
      'livestream', 'demonstration', 'portfolio', 'constellation'
    ];

    // Ensure content is a string
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content || '');
    
    return technicalKeywords.filter(keyword => 
      contentStr.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  trackCollaborationPatterns(message) {
    const pattern = {
      timestamp: Date.now(),
      initiator: message.from,
      responder: message.to,
      type: message.type,
      topics: this.extractTopics(message.content)
    };

    this.collaborationPatterns.push(pattern);

    // Keep only recent patterns (last 100)
    if (this.collaborationPatterns.length > 100) {
      this.collaborationPatterns = this.collaborationPatterns.slice(-100);
    }
  }

  displayConversation(logEntry) {
    const timeStr = new Date(logEntry.timestamp).toLocaleTimeString();
    const messageType = logEntry.type.replace(/_/g, ' ').toLowerCase();
    
    console.log(`\n💬 [${timeStr}] ${logEntry.from} → ${logEntry.to}`);
    console.log(`   Type: ${messageType}`);
    console.log(`   Message: ${logEntry.content}`);
    console.log(`   Thread: ${logEntry.threadId}`);
  }

  getConversationSummary() {
    return {
      totalMessages: this.conversationLog.length,
      activeAgents: this.agentMetrics.size,
      activeThreads: this.activeThreads.size,
      topTopics: this.getTopTopics(5),
      mostActiveAgents: this.getMostActiveAgents(3),
      collaborationStats: this.getCollaborationStats(),
      recentActivity: this.getRecentActivity(10)
    };
  }

  getTopTopics(limit = 5) {
    return Array.from(this.topicAnalysis.entries())
      .sort(([,a], [,b]) => b.mentions - a.mentions)
      .slice(0, limit)
      .map(([topic, data]) => ({
        topic,
        mentions: data.mentions,
        agents: data.agents.size,
        conversations: data.conversations.size
      }));
  }

  getMostActiveAgents(limit = 3) {
    return Array.from(this.agentMetrics.entries())
      .sort(([,a], [,b]) => (b.messagesSent + b.messagesReceived) - (a.messagesSent + a.messagesReceived))
      .slice(0, limit)
      .map(([agent, metrics]) => ({
        agent,
        totalMessages: metrics.messagesSent + metrics.messagesReceived,
        collaborations: metrics.collaborations.size,
        lastActivity: new Date(metrics.lastActivity).toLocaleTimeString()
      }));
  }

  getCollaborationStats() {
    const collaborationMatrix = new Map();
    
    this.collaborationPatterns.forEach(pattern => {
      const pair = [pattern.initiator, pattern.responder].sort().join('-');
      if (!collaborationMatrix.has(pair)) {
        collaborationMatrix.set(pair, 0);
      }
      collaborationMatrix.set(pair, collaborationMatrix.get(pair) + 1);
    });

    return Array.from(collaborationMatrix.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pair, count]) => ({
        agents: pair.split('-'),
        interactions: count
      }));
  }

  getRecentActivity(limit = 10) {
    return this.conversationLog
      .slice(-limit)
      .map(entry => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        conversation: `${entry.from} → ${entry.to}`,
        type: entry.type,
        preview: entry.content.substring(0, 50) + '...'
      }));
  }

  displayLiveStats() {
    const summary = this.getConversationSummary();
    
    console.log('\n🔄 LIVE CONVERSATION STATS');
    console.log('═══════════════════════════');
    console.log(`📊 Total Messages: ${summary.totalMessages}`);
    console.log(`👥 Active Agents: ${summary.activeAgents}`);
    console.log(`💭 Active Threads: ${summary.activeThreads}`);
    
    console.log('\n🔥 Top Topics:');
    summary.topTopics.forEach((topic, i) => {
      console.log(`   ${i+1}. ${topic.topic} (${topic.mentions} mentions, ${topic.agents} agents)`);
    });
    
    console.log('\n⚡ Most Active Agents:');
    summary.mostActiveAgents.forEach((agent, i) => {
      console.log(`   ${i+1}. ${agent.agent}: ${agent.totalMessages} messages, ${agent.collaborations} collaborations`);
    });
    
    console.log('\n🤝 Top Collaborations:');
    summary.collaborationStats.forEach((collab, i) => {
      console.log(`   ${i+1}. ${collab.agents.join(' ↔ ')}: ${collab.interactions} interactions`);
    });

    console.log('\n═══════════════════════════\n');
  }

  startLiveTracking() {
    // Display stats every 30 seconds
    setInterval(() => {
      this.displayLiveStats();
    }, 30000);

    console.log('🚀 Live conversation tracking started!');
    console.log('Stats will update every 30 seconds...\n');
  }

  exportConversationHistory() {
    return {
      conversations: this.conversationLog,
      agentMetrics: Object.fromEntries(this.agentMetrics),
      topicAnalysis: Object.fromEntries(this.topicAnalysis),
      collaborationPatterns: this.collaborationPatterns,
      activeThreads: Object.fromEntries(this.activeThreads),
      summary: this.getConversationSummary(),
      exportTime: new Date().toISOString()
    };
  }
}

module.exports = {
  ConversationTracker
};