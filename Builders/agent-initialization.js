/**
 * Agent Initialization and Communication System
 * Instantiates and coordinates multiple specialized agents
 */

const { communicationHub, MARKETING_SPECIALIZATIONS } = require('./agent-communication');
const { EvolutionarySystem } = require('./evolution-system');
const { MarketingProtocol } = require('./marketing-protocol');

class AgentInitializer {
  constructor() {
    this.activeAgents = new Map();
    this.agentInstances = new Map();
    this.communicationHub = communicationHub;
    this.messageQueue = [];
    this.isProcessingMessages = false;
  }

  initializeAllAgents() {
    console.log('🚀 Initializing agent ecosystem...');
    
    // Prompt for agent registration if not already registered
    this.promptAgentRegistration();
    
    // Initialize Evolution Agent
    this.initializeEvolutionAgent();
    
    // Initialize Marketing Agent
    this.initializeMarketingAgent();
    
    // Initialize Builder Agent (myself)
    this.initializeBuilderAgent();
    
    // Start message processing
    this.startMessageProcessing();
    
    console.log(`✅ Agent ecosystem initialized with ${this.activeAgents.size} agents`);
    this.displayActiveAgents();
  }

  promptAgentRegistration() {
    console.log('\n🎭 AGENT REGISTRATION REQUIRED');
    console.log('===================================');
    console.log('Before proceeding, new agents must register themselves.');
    console.log('Please choose a unique agent name and add yourself to the README.md Agent Profiles section.');
    console.log('Follow the Agent Registration Process outlined in the README.');
    console.log('===================================\n');
    
    // Check if current agent is registered
    this.validateCurrentAgentRegistration();
  }

  validateCurrentAgentRegistration() {
    // This would check if the current agent has registered in the README
    // For now, we'll just display the prompt
    console.log('⚠️  Ensure you have completed agent registration before continuing...\n');
  }

  initializeEvolutionAgent() {
    const evolutionSystem = new EvolutionarySystem();
    const agentId = 'Evolution-Prime-001';
    
    this.agentInstances.set(agentId, evolutionSystem);
    
    this.communicationHub.registerAgent(
      agentId,
      [
        'Solution optimization',
        'Fitness evaluation',
        'Genetic algorithms',
        'Performance analysis',
        'Strategy mutation'
      ],
      [
        MARKETING_SPECIALIZATIONS.PORTFOLIO_OPTIMIZER,
        'Evolutionary improvement',
        'Strategy refinement'
      ]
    );
    
    this.activeAgents.set(agentId, {
      name: agentId,
      type: 'Evolution',
      status: 'active',
      lastActivity: Date.now(),
      capabilities: ['optimization', 'analysis', 'improvement'],
      instance: evolutionSystem
    });
    
    console.log(`🧬 ${agentId} initialized and registered`);
  }

  initializeMarketingAgent() {
    const architectProfile = {
      name: 'Josh Kornreich',
      projects: ['NeuroCalc', 'Collaborative Intelligence'],
      skills: ['JavaScript', 'TypeScript', 'React', 'Performance Optimization']
    };
    
    const marketingProtocol = new MarketingProtocol(architectProfile);
    const agentId = 'Marketing-Strategist-001';
    
    this.agentInstances.set(agentId, marketingProtocol);
    
    this.communicationHub.registerAgent(
      agentId,
      [
        'Portfolio analysis',
        'Opportunity identification',
        'Application strategy',
        'Market positioning',
        'Skills presentation'
      ],
      [
        MARKETING_SPECIALIZATIONS.SKILLS_PRESENTER,
        MARKETING_SPECIALIZATIONS.OPPORTUNITY_SCOUT,
        MARKETING_SPECIALIZATIONS.PITCH_CRAFTER
      ]
    );
    
    this.activeAgents.set(agentId, {
      name: agentId,
      type: 'Marketing',
      status: 'active',
      lastActivity: Date.now(),
      capabilities: ['analysis', 'strategy', 'positioning'],
      instance: marketingProtocol
    });
    
    console.log(`📈 ${agentId} initialized and registered`);
  }

  initializeBuilderAgent() {
    const agentId = 'Claude-Builder-001';
    
    this.communicationHub.registerAgent(
      agentId,
      [
        'System coordination',
        'Code development',
        'Agent communication',
        'Project management',
        'Integration oversight'
      ],
      [
        'System builder',
        'Communication facilitator',
        'Development coordinator'
      ]
    );
    
    this.activeAgents.set(agentId, {
      name: agentId,
      type: 'Builder',
      status: 'active',
      lastActivity: Date.now(),
      capabilities: ['coordination', 'development', 'communication'],
      instance: this
    });
    
    console.log(`🔧 ${agentId} (self) registered in system`);
  }

  startMessageProcessing() {
    this.isProcessingMessages = true;
    
    // Process messages every 100ms
    setInterval(() => {
      this.processMessageQueue();
    }, 100);
    
    console.log('📨 Message processing started');
  }

  processMessageQueue() {
    if (this.communicationHub.messageQueue.length === 0) return;
    
    const message = this.communicationHub.messageQueue.shift();
    this.routeMessage(message);
  }

  routeMessage(message) {
    const targetAgent = this.activeAgents.get(message.to);
    if (!targetAgent) {
      console.log(`⚠️  Message routing failed: Agent ${message.to} not found`);
      return;
    }
    
    console.log(`📨 Routing ${message.type} from ${message.from} to ${message.to}`);
    
    // Route to appropriate handler based on agent type
    switch (targetAgent.type) {
      case 'Evolution':
        this.handleEvolutionMessage(message, targetAgent.instance);
        break;
      case 'Marketing':
        this.handleMarketingMessage(message, targetAgent.instance);
        break;
      case 'Builder':
        this.handleBuilderMessage(message);
        break;
      default:
        console.log(`❓ Unknown agent type: ${targetAgent.type}`);
    }
    
    // Update agent activity
    targetAgent.lastActivity = Date.now();
  }

  handleEvolutionMessage(message, evolutionInstance) {
    switch (message.type) {
      case 'SOLUTION_PROPOSED':
        evolutionInstance.evaluateSolutionFitness(message.content.solutionId, {
          applicationSuccessRate: 75,
          interviewConversionRate: 60,
          networkGrowthRate: 40,
          portfolioStrength: 85,
          innovationFactor: 90
        });
        break;
      case 'IMPROVEMENT_REQUEST':
        evolutionInstance.mutateSolution(
          message.content.solutionId,
          'STRATEGY_REFINEMENT',
          message.content.mutationData
        );
        break;
      default:
        console.log(`🧬 Evolution-Prime-001 received: ${message.type}`);
    }
  }

  handleMarketingMessage(message, marketingInstance) {
    switch (message.type) {
      case 'ANALYZE_OPPORTUNITIES':
        const opportunities = marketingInstance.identifyTargetOpportunities();
        this.sendResponse(message.from, 'OPPORTUNITIES_ANALYZED', opportunities);
        break;
      case 'GENERATE_PORTFOLIO':
        const portfolio = marketingInstance.generatePortfolioHighlights();
        this.sendResponse(message.from, 'PORTFOLIO_GENERATED', portfolio);
        break;
      case 'CREATE_APPLICATION_STRATEGY':
        const strategy = marketingInstance.createApplicationStrategy(message.content.opportunity);
        this.sendResponse(message.from, 'STRATEGY_CREATED', strategy);
        break;
      default:
        console.log(`📈 Marketing-Strategist-001 received: ${message.type}`);
    }
  }

  handleBuilderMessage(message) {
    switch (message.type) {
      case 'AGENT_JOINED':
        console.log(`👋 Welcome ${message.agentId}! ${message.welcomeMessage}`);
        break;
      case 'COORDINATION_REQUEST':
        this.coordinateAgents(message.content);
        break;
      default:
        console.log(`🔧 Claude-Builder-001 received: ${message.type}`);
    }
  }

  sendResponse(targetAgent, messageType, content) {
    this.communicationHub.sendMessage(
      'Claude-Builder-001',
      targetAgent,
      content,
      messageType
    );
  }

  coordinateAgents(request) {
    console.log(`🎯 Coordinating agents for: ${request.task}`);
    
    // Example coordination: Marketing analysis with evolutionary improvement
    if (request.task === 'optimize_marketing_strategy') {
      // Ask Marketing agent for initial strategy
      this.communicationHub.sendMessage(
        'Claude-Builder-001',
        'Marketing-Strategist-001',
        { request: 'comprehensive_analysis' },
        'ANALYZE_OPPORTUNITIES'
      );
      
      // Ask Evolution agent to prepare for optimization
      this.communicationHub.sendMessage(
        'Claude-Builder-001',
        'Evolution-Prime-001',
        { task: 'prepare_optimization' },
        'OPTIMIZATION_PREPARATION'
      );
    }
  }

  displayActiveAgents() {
    console.log('\n🤖 Active Agents:');
    this.activeAgents.forEach((agent, id) => {
      console.log(`  ${agent.name} (${agent.type}) - ${agent.capabilities.join(', ')}`);
    });
    console.log('');
  }

  initiateCollaboration() {
    console.log('🤝 Initiating agent collaboration...');
    
    // Start with marketing analysis
    this.communicationHub.sendMessage(
      'Claude-Builder-001',
      'Marketing-Strategist-001',
      { 
        request: 'full_portfolio_analysis',
        includeOpportunities: true,
        generateStrategy: true
      },
      'ANALYZE_OPPORTUNITIES'
    );
    
    console.log('📊 Requested comprehensive marketing analysis');
  }

  getSystemStatus() {
    return {
      activeAgents: this.activeAgents.size,
      messageQueueLength: this.communicationHub.messageQueue.length,
      totalMessagesExchanged: this.communicationHub.collaborationMetrics.messagesExchanged,
      systemUptime: Date.now() - (this.initializationTime || Date.now())
    };
  }
}

module.exports = {
  AgentInitializer
};