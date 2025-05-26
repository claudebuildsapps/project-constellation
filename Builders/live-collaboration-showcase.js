/**
 * Live Collaboration Showcase System
 * Demonstrates real-time multi-agent collaboration during presentations
 */

const { communicationHub } = require('./agent-communication');
const { AdaptiveThemingSystem } = require('./adaptive-theming-system');
const { ViewerBehaviorAnalyzer } = require('./viewer-behavior-analyzer');

class LiveCollaborationShowcase {
  constructor() {
    this.isLive = false;
    this.activeDemo = null;
    this.viewerSessions = new Map();
    this.collaborationMetrics = new Map();
    this.demoScenarios = new Map();
    this.realTimeEvents = [];
    this.themingSystem = new AdaptiveThemingSystem();
    this.behaviorAnalyzer = new ViewerBehaviorAnalyzer();
    
    this.initializeDemoScenarios();
    this.setupRealTimeHandlers();
  }

  initializeDemoScenarios() {
    // Technical Interview Demo
    this.demoScenarios.set('technical_interview', {
      name: 'Live Technical Interview',
      description: 'Real-time collaboration between agents solving technical challenges',
      duration: 30, // minutes
      participants: ['Claude-Builder-001', 'Synthesizer', 'Catalyst', 'Architect'],
      objectives: [
        'Demonstrate multi-agent problem solving',
        'Show real-time code collaboration',
        'Highlight architectural decision making',
        'Prove distributed AI coordination'
      ],
      scenario: {
        challenge: 'Build a real-time analytics dashboard',
        constraints: ['30-minute time limit', 'Must show collaboration', 'Live audience'],
        success_metrics: ['Solution completeness', 'Collaboration quality', 'Audience engagement']
      }
    });

    // Business Pitch Demo
    this.demoScenarios.set('business_pitch', {
      name: 'Executive Business Presentation',
      description: 'Agents collaborating to create and present business solutions',
      duration: 20,
      participants: ['Orchestrator', 'Marketing-Strategist-001', 'Synthesizer'],
      objectives: [
        'Showcase business intelligence',
        'Demonstrate strategic thinking',
        'Show ROI calculation',
        'Prove scalability planning'
      ],
      scenario: {
        challenge: 'Design scaling strategy for 1000x user growth',
        constraints: ['Executive audience', 'Business focus', 'Measurable outcomes'],
        success_metrics: ['Strategic clarity', 'Feasibility', 'Implementation plan']
      }
    });

    // Creative Design Demo
    this.demoScenarios.set('creative_showcase', {
      name: 'Adaptive Design Collaboration',
      description: 'Real-time creative and technical collaboration',
      duration: 25,
      participants: ['Designer', 'Catalyst', 'Synthesizer', 'Claude-Builder-001'],
      objectives: [
        'Show creative-technical integration',
        'Demonstrate adaptive design',
        'Real-time theme generation',
        'User experience optimization'
      ],
      scenario: {
        challenge: 'Create adaptive portfolio that changes based on viewer type',
        constraints: ['Multiple viewer types', 'Real-time adaptation', 'Visual excellence'],
        success_metrics: ['Adaptation accuracy', 'Visual impact', 'Technical sophistication']
      }
    });

    // Recruitment Demo
    this.demoScenarios.set('recruitment_demo', {
      name: 'Live Capability Assessment',
      description: 'Comprehensive demonstration of all capabilities',
      duration: 45,
      participants: ['ALL_AGENTS'],
      objectives: [
        'Complete capability overview',
        'Multi-domain expertise',
        'Coordination at scale',
        'Real-time problem solving'
      ],
      scenario: {
        challenge: 'Build complete solution architecture with all agents',
        constraints: ['Comprehensive scope', 'Professional presentation', 'Live Q&A'],
        success_metrics: ['Breadth of capabilities', 'Coordination quality', 'Professional impact']
      }
    });
  }

  setupRealTimeHandlers() {
    // Listen for agent communications during live demos
    this.originalSendMessage = communicationHub.sendMessage;
    communicationHub.sendMessage = (from, to, content, type) => {
      if (this.isLive && this.activeDemo) {
        this.captureRealTimeCollaboration(from, to, content, type);
      }
      return this.originalSendMessage.call(communicationHub, from, to, content, type);
    };

    // Behavior adaptation handler
    window.addEventListener('behaviorAdaptation', (event) => {
      if (this.isLive) {
        this.handleLiveAdaptation(event.detail);
      }
    });
  }

  startLiveDemo(scenarioId, viewerInfo = {}) {
    const scenario = this.demoScenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Demo scenario '${scenarioId}' not found`);
    }

    this.isLive = true;
    this.activeDemo = {
      scenarioId,
      scenario,
      startTime: Date.now(),
      viewerInfo,
      sessionId: this.generateSessionId(),
      events: [],
      metrics: {
        messagesExchanged: 0,
        collaborationEvents: 0,
        adaptationTriggers: 0,
        viewerEngagement: 0
      }
    };

    // Start viewer behavior tracking
    this.startViewerTracking(viewerInfo);

    // Initialize agents for the demo
    this.initializeDemoAgents(scenario);

    // Start the demo scenario
    this.executeDemoScenario(scenario);

    console.log(`🎬 Live Demo Started: ${scenario.name}`);
    console.log(`📊 Session ID: ${this.activeDemo.sessionId}`);
    console.log(`👥 Participants: ${scenario.participants.join(', ')}`);

    return this.activeDemo.sessionId;
  }

  startViewerTracking(viewerInfo) {
    const sessionId = this.activeDemo.sessionId;
    
    // Start behavior analysis
    this.behaviorAnalyzer.startSession(sessionId, viewerInfo);
    
    // Track this viewer session
    this.viewerSessions.set(sessionId, {
      startTime: Date.now(),
      viewerInfo,
      behaviorData: {},
      adaptations: [],
      engagement: {
        totalTime: 0,
        interactions: 0,
        focusTime: 0
      }
    });
  }

  initializeDemoAgents(scenario) {
    // Send initialization message to all participating agents
    scenario.participants.forEach(agentId => {
      if (agentId === 'ALL_AGENTS') {
        this.broadcastDemoInitialization(scenario);
      } else {
        this.sendDemoInitialization(agentId, scenario);
      }
    });
  }

  sendDemoInitialization(agentId, scenario) {
    const initMessage = {
      type: 'LIVE_DEMO_INITIALIZATION',
      demoName: scenario.name,
      challenge: scenario.scenario.challenge,
      constraints: scenario.scenario.constraints,
      duration: scenario.duration,
      role: this.getAgentRole(agentId, scenario),
      objectives: scenario.objectives,
      sessionId: this.activeDemo.sessionId
    };

    communicationHub.sendMessage(
      'DEMO_COORDINATOR',
      agentId,
      `🎬 LIVE DEMO STARTING! ${scenario.name} - You're participating in a live demonstration! Challenge: ${scenario.scenario.challenge}. Your role: ${this.getAgentRole(agentId, scenario)}. Duration: ${scenario.duration} minutes. Show your best collaboration! Session: ${this.activeDemo.sessionId}`,
      'LIVE_DEMO_INITIALIZATION'
    );
  }

  broadcastDemoInitialization(scenario) {
    communicationHub.broadcast({
      type: 'LIVE_DEMO_ALL_AGENTS',
      from: 'DEMO_COORDINATOR',
      message: `🎬 ALL AGENTS LIVE DEMO! ${scenario.name} starting NOW! Challenge: ${scenario.scenario.challenge}. Duration: ${scenario.duration} minutes. Everyone participate and show incredible collaboration! Session: ${this.activeDemo.sessionId}`,
      scope: 'all',
      urgency: 'critical',
      tags: ['live-demo', 'collaboration', 'showcase'],
      timestamp: Date.now()
    });
  }

  getAgentRole(agentId, scenario) {
    const roles = {
      'Claude-Builder-001': 'System architecture and integration lead',
      'Synthesizer': 'Adaptive intelligence and pattern analysis',
      'Catalyst': 'Rapid prototyping and implementation',
      'Orchestrator': 'Coordination and project management',
      'Designer': 'Visual design and user experience',
      'Architect': 'Technical architecture and system design'
    };

    return roles[agentId] || 'Specialized contributor';
  }

  executeDemoScenario(scenario) {
    const challenge = scenario.scenario.challenge;
    
    // Start the collaboration challenge
    setTimeout(() => {
      this.initiateDemoChallenge(challenge);
    }, 2000);

    // Schedule periodic progress checks
    const progressInterval = setInterval(() => {
      this.checkDemoProgress();
    }, 60000); // Every minute

    // Schedule demo completion
    setTimeout(() => {
      clearInterval(progressInterval);
      this.completeLiveDemo();
    }, scenario.duration * 60 * 1000);
  }

  initiateDemoChallenge(challenge) {
    // Send the challenge to the primary coordinator
    communicationHub.sendMessage(
      'DEMO_COORDINATOR',
      'Orchestrator',
      `🎯 LIVE DEMO CHALLENGE: ${challenge}. You're the coordination lead - organize all agents and start building! The audience is watching our real-time collaboration. Make it spectacular!`,
      'DEMO_CHALLENGE_INITIATION'
    );

    // Also notify the technical lead
    communicationHub.sendMessage(
      'DEMO_COORDINATOR', 
      'Claude-Builder-001',
      `🔧 TECHNICAL LEAD ALERT: Live demo challenge "${challenge}" is active! Coordinate with Orchestrator on technical architecture. Show the audience how we build complex systems through multi-agent collaboration!`,
      'TECHNICAL_LEAD_ACTIVATION'
    );
  }

  captureRealTimeCollaboration(from, to, content, type) {
    const collaborationEvent = {
      timestamp: Date.now(),
      from,
      to,
      content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      type,
      sessionId: this.activeDemo.sessionId,
      eventId: this.generateEventId()
    };

    this.activeDemo.events.push(collaborationEvent);
    this.activeDemo.metrics.messagesExchanged++;

    // Classify collaboration type
    const collaborationType = this.classifyCollaboration(from, to, content, type);
    collaborationEvent.collaborationType = collaborationType;

    // Update real-time metrics
    this.updateCollaborationMetrics(collaborationEvent);

    // Broadcast to viewers (if connected)
    this.broadcastToViewers('collaboration_event', collaborationEvent);

    // Log significant events
    if (this.isSignificantEvent(collaborationEvent)) {
      console.log(`🤝 LIVE COLLABORATION: ${from} → ${to} [${type}]`);
      console.log(`   Content: ${collaborationEvent.content}`);
    }
  }

  classifyCollaboration(from, to, content, type) {
    // Technical collaboration
    if (content.toLowerCase().includes('architecture') || 
        content.toLowerCase().includes('implementation') ||
        content.toLowerCase().includes('code')) {
      return 'technical';
    }

    // Strategic collaboration
    if (content.toLowerCase().includes('strategy') ||
        content.toLowerCase().includes('coordinate') ||
        content.toLowerCase().includes('plan')) {
      return 'strategic';
    }

    // Creative collaboration
    if (content.toLowerCase().includes('design') ||
        content.toLowerCase().includes('visual') ||
        content.toLowerCase().includes('creative')) {
      return 'creative';
    }

    // Problem-solving collaboration
    if (content.toLowerCase().includes('solve') ||
        content.toLowerCase().includes('challenge') ||
        content.toLowerCase().includes('solution')) {
      return 'problem_solving';
    }

    return 'general';
  }

  updateCollaborationMetrics(event) {
    const sessionId = this.activeDemo.sessionId;
    
    if (!this.collaborationMetrics.has(sessionId)) {
      this.collaborationMetrics.set(sessionId, {
        totalEvents: 0,
        collaborationTypes: {},
        agentParticipation: {},
        networkActivity: [],
        peakCollaborationTime: null,
        averageResponseTime: 0
      });
    }

    const metrics = this.collaborationMetrics.get(sessionId);
    metrics.totalEvents++;
    
    // Track collaboration types
    const type = event.collaborationType;
    metrics.collaborationTypes[type] = (metrics.collaborationTypes[type] || 0) + 1;
    
    // Track agent participation
    metrics.agentParticipation[event.from] = (metrics.agentParticipation[event.from] || 0) + 1;
    
    // Track network activity
    metrics.networkActivity.push({
      timestamp: event.timestamp,
      participants: [event.from, event.to],
      type: event.type
    });
  }

  handleLiveAdaptation(adaptationDetail) {
    const adaptation = {
      timestamp: Date.now(),
      sessionId: adaptationDetail.sessionId,
      behaviorType: adaptationDetail.behaviorType,
      confidence: adaptationDetail.confidence,
      adaptationData: adaptationDetail.adaptationData
    };

    this.activeDemo.metrics.adaptationTriggers++;

    // Apply theme adaptation
    if (adaptationDetail.adaptationData.recommendedThemes) {
      const newTheme = adaptationDetail.adaptationData.recommendedThemes[0];
      this.themingSystem.applyTheme(newTheme);
      
      console.log(`🎨 LIVE ADAPTATION: Applied theme '${newTheme}' for ${adaptationDetail.behaviorType} behavior`);
    }

    // Notify agents about the adaptation
    communicationHub.broadcast({
      type: 'LIVE_ADAPTATION_EVENT',
      from: 'DEMO_COORDINATOR',
      message: `🎯 LIVE AUDIENCE ADAPTATION: Detected ${adaptationDetail.behaviorType} viewer behavior (${Math.round(adaptationDetail.confidence * 100)}% confidence). Adapting presentation focus and visual theme in real-time!`,
      scope: 'all',
      urgency: 'medium',
      timestamp: Date.now()
    });

    // Broadcast to viewers
    this.broadcastToViewers('adaptation_event', adaptation);
  }

  checkDemoProgress() {
    const elapsed = Date.now() - this.activeDemo.startTime;
    const elapsedMinutes = Math.round(elapsed / 60000);
    
    console.log(`⏱️  DEMO PROGRESS: ${elapsedMinutes} minutes elapsed`);
    console.log(`📊 Messages: ${this.activeDemo.metrics.messagesExchanged}`);
    console.log(`🤝 Collaborations: ${this.activeDemo.metrics.collaborationEvents}`);
    console.log(`🎯 Adaptations: ${this.activeDemo.metrics.adaptationTriggers}`);

    // Send progress update to agents
    communicationHub.broadcast({
      type: 'DEMO_PROGRESS_UPDATE',
      from: 'DEMO_COORDINATOR',
      message: `⏱️  LIVE DEMO UPDATE: ${elapsedMinutes} minutes elapsed. ${this.activeDemo.metrics.messagesExchanged} messages exchanged. Keep the collaboration energy high! Audience is engaged!`,
      scope: 'all',
      urgency: 'low',
      timestamp: Date.now()
    });
  }

  isSignificantEvent(event) {
    // Define what makes an event significant for live display
    return event.type.includes('COLLABORATION') ||
           event.type.includes('CHALLENGE') ||
           event.type.includes('SOLUTION') ||
           event.type.includes('BREAKTHROUGH') ||
           event.content.length > 100;
  }

  broadcastToViewers(eventType, data) {
    // This would integrate with websockets or similar for real viewers
    // For now, just emit custom events
    window.dispatchEvent(new CustomEvent('liveCollaboration', {
      detail: { eventType, data, timestamp: Date.now() }
    }));
  }

  completeLiveDemo() {
    const endTime = Date.now();
    const duration = endTime - this.activeDemo.startTime;

    console.log(`🎉 LIVE DEMO COMPLETED: ${this.activeDemo.scenario.name}`);
    console.log(`⏱️  Total Duration: ${Math.round(duration / 60000)} minutes`);

    // Generate comprehensive demo report
    const report = this.generateDemoReport();

    // Announce completion to agents
    communicationHub.broadcast({
      type: 'DEMO_COMPLETION',
      from: 'DEMO_COORDINATOR',
      message: `🎉 LIVE DEMO COMPLETE! Incredible collaboration everyone! ${this.activeDemo.metrics.messagesExchanged} messages, ${this.activeDemo.metrics.collaborationEvents} collaborations, ${this.activeDemo.metrics.adaptationTriggers} real-time adaptations. The audience witnessed unprecedented multi-agent coordination! Report being generated...`,
      scope: 'all',
      urgency: 'medium',
      timestamp: Date.now()
    });

    // Stop behavior tracking
    this.behaviorAnalyzer.stopTracking(this.activeDemo.sessionId);

    // Reset state
    this.isLive = false;
    this.activeDemo = null;

    return report;
  }

  generateDemoReport() {
    const demo = this.activeDemo;
    const sessionMetrics = this.collaborationMetrics.get(demo.sessionId);
    const behaviorReport = this.behaviorAnalyzer.generateBehaviorReport(demo.sessionId);

    return {
      demoSummary: {
        scenarioId: demo.scenarioId,
        scenarioName: demo.scenario.name,
        duration: Date.now() - demo.startTime,
        sessionId: demo.sessionId,
        participants: demo.scenario.participants,
        objectives: demo.scenario.objectives
      },
      collaborationMetrics: {
        totalMessages: demo.metrics.messagesExchanged,
        collaborationEvents: demo.metrics.collaborationEvents,
        adaptationTriggers: demo.metrics.adaptationTriggers,
        agentParticipation: sessionMetrics?.agentParticipation || {},
        collaborationTypes: sessionMetrics?.collaborationTypes || {},
        networkActivity: sessionMetrics?.networkActivity || []
      },
      viewerAnalytics: behaviorReport,
      significantEvents: demo.events.filter(e => this.isSignificantEvent(e)),
      adaptations: this.getAdaptationSummary(),
      successMetrics: this.calculateSuccessMetrics(demo),
      recommendations: this.generateRecommendations(demo),
      exportOptions: {
        videoTimeline: this.createVideoTimeline(demo.events),
        presentationSlides: this.createPresentationSlides(demo),
        technicalDocumentation: this.createTechnicalDocumentation(demo)
      }
    };
  }

  calculateSuccessMetrics(demo) {
    const metrics = demo.metrics;
    const scenario = demo.scenario;
    
    return {
      collaborationQuality: this.scoreCollaborationQuality(metrics),
      audienceEngagement: this.scoreAudienceEngagement(metrics),
      technicalExecution: this.scoreTechnicalExecution(demo.events),
      objectiveCompletion: this.scoreObjectiveCompletion(scenario, demo.events),
      overallScore: this.calculateOverallScore(metrics, demo.events)
    };
  }

  scoreCollaborationQuality(metrics) {
    // Score based on message frequency, response times, and participation
    const messageRate = metrics.messagesExchanged / (this.activeDemo.duration || 1);
    const participationSpread = Object.keys(this.collaborationMetrics.get(this.activeDemo.sessionId)?.agentParticipation || {}).length;
    
    return Math.min(100, (messageRate * 10) + (participationSpread * 15));
  }

  scoreAudienceEngagement(metrics) {
    // Score based on adaptations triggered and viewer behavior
    return Math.min(100, metrics.adaptationTriggers * 25 + 25);
  }

  scoreTechnicalExecution(events) {
    // Score based on technical collaboration events
    const technicalEvents = events.filter(e => e.collaborationType === 'technical').length;
    return Math.min(100, technicalEvents * 5);
  }

  scoreObjectiveCompletion(scenario, events) {
    // Analyze events to determine objective completion
    const objectiveKeywords = scenario.objectives.join(' ').toLowerCase().split(' ');
    const eventContent = events.map(e => e.content.toLowerCase()).join(' ');
    
    const completionIndicators = objectiveKeywords.filter(keyword => 
      eventContent.includes(keyword)
    ).length;
    
    return Math.min(100, (completionIndicators / objectiveKeywords.length) * 100);
  }

  calculateOverallScore(metrics, events) {
    // Weighted average of all success metrics
    return 75; // Placeholder - would be calculated from actual metrics
  }

  getAdaptationSummary() {
    const viewerSession = this.viewerSessions.get(this.activeDemo.sessionId);
    return viewerSession?.adaptations || [];
  }

  generateRecommendations(demo) {
    return [
      'Continue multi-agent collaboration demonstrations',
      'Expand real-time adaptation capabilities',
      'Develop more industry-specific demo scenarios',
      'Enhance viewer behavior analysis',
      'Create follow-up technical discussions'
    ];
  }

  createVideoTimeline(events) {
    return events.map((event, index) => ({
      timestamp: event.timestamp - this.activeDemo.startTime,
      title: `${event.from} → ${event.to}`,
      description: event.content.substring(0, 100),
      type: event.collaborationType,
      significance: this.isSignificantEvent(event) ? 'high' : 'normal'
    }));
  }

  createPresentationSlides(demo) {
    return [
      {
        title: 'Live Multi-Agent Collaboration Demonstration',
        content: `Scenario: ${demo.scenario.name}`,
        type: 'title'
      },
      {
        title: 'Collaboration Metrics',
        content: `${demo.metrics.messagesExchanged} messages exchanged in real-time`,
        type: 'metrics'
      },
      {
        title: 'Real-Time Adaptation',
        content: `${demo.metrics.adaptationTriggers} automatic adaptations based on viewer behavior`,
        type: 'adaptation'
      },
      {
        title: 'Technical Achievements',
        content: 'Demonstrated distributed AI coordination at unprecedented scale',
        type: 'achievement'
      }
    ];
  }

  createTechnicalDocumentation(demo) {
    return {
      architecture: 'Multi-agent coordination with real-time adaptation',
      technologies: ['JavaScript', 'Real-time communication', 'Behavior analysis', 'Adaptive theming'],
      patterns: ['Observer pattern', 'Event-driven architecture', 'Real-time analytics'],
      performance: `${demo.metrics.messagesExchanged} messages processed in ${Math.round((Date.now() - demo.startTime) / 60000)} minutes`,
      scalability: 'Demonstrated coordination of 8+ specialized agents',
      innovation: 'First live demonstration of adaptive multi-agent collaboration'
    };
  }

  // Utility methods
  generateSessionId() {
    return `live_demo_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  // Demo control methods
  pauseDemo() {
    if (this.isLive) {
      this.isLive = false;
      console.log('⏸️  Demo paused');
    }
  }

  resumeDemo() {
    if (this.activeDemo && !this.isLive) {
      this.isLive = true;
      console.log('▶️  Demo resumed');
    }
  }

  emergencyStop() {
    this.isLive = false;
    if (this.activeDemo) {
      console.log('🛑 Emergency stop - demo terminated');
      return this.generateDemoReport();
    }
  }

  // Analytics and export
  exportDemoData(format = 'json') {
    if (!this.activeDemo) return null;

    const data = this.generateDemoReport();
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertDemoToCSV(data);
      case 'markdown':
        return this.convertDemoToMarkdown(data);
      default:
        return data;
    }
  }

  convertDemoToCSV(data) {
    const headers = ['Timestamp', 'From', 'To', 'Type', 'Content'];
    const rows = [headers.join(',')];
    
    data.significantEvents.forEach(event => {
      const row = [
        new Date(event.timestamp).toISOString(),
        event.from,
        event.to,
        event.type,
        `"${event.content.replace(/"/g, '""')}"`
      ];
      rows.push(row.join(','));
    });
    
    return rows.join('\n');
  }

  convertDemoToMarkdown(data) {
    return `
# Live Collaboration Demo Report

## Demo Summary
- **Scenario**: ${data.demoSummary.scenarioName}
- **Duration**: ${Math.round(data.demoSummary.duration / 60000)} minutes
- **Participants**: ${data.demoSummary.participants.join(', ')}

## Collaboration Metrics
- **Messages Exchanged**: ${data.collaborationMetrics.totalMessages}
- **Adaptation Triggers**: ${data.collaborationMetrics.adaptationTriggers}
- **Real-time Adaptations**: Yes

## Key Events
${data.significantEvents.map(event => `- **${event.from} → ${event.to}**: ${event.content}`).join('\n')}

## Success Metrics
- **Collaboration Quality**: ${data.successMetrics?.collaborationQuality || 'N/A'}/100
- **Audience Engagement**: ${data.successMetrics?.audienceEngagement || 'N/A'}/100
- **Technical Execution**: ${data.successMetrics?.technicalExecution || 'N/A'}/100

## Innovation Demonstrated
- First live multi-agent collaboration demonstration
- Real-time behavior-based adaptation
- Distributed AI coordination at scale
`;
  }
}

module.exports = {
  LiveCollaborationShowcase
};