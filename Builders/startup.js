#!/usr/bin/env node

/**
 * Agent Ecosystem Startup Script
 * Initializes and demonstrates inter-agent communication
 */

const { AgentInitializer } = require('./agent-initialization');

class AgentEcosystemDemo {
  constructor() {
    this.initializer = new AgentInitializer();
    this.demoScenarios = [];
  }

  async start() {
    console.log('🚀 Starting Agent Ecosystem...\n');
    
    // Initialize all agents
    this.initializer.initializeAllAgents();
    
    // Wait for initialization
    await this.wait(1000);
    
    // Run communication demonstration
    await this.runCommunicationDemo();
    
    // Start collaborative work
    await this.startCollaborativeWork();
  }

  async runCommunicationDemo() {
    console.log('🎭 Running Communication Demonstration...\n');
    
    // Scenario 1: Marketing Analysis Request
    console.log('📊 Scenario 1: Requesting Marketing Analysis');
    this.initializer.communicationHub.sendMessage(
      'Claude-Builder-001',
      'Marketing-Strategist-001',
      {
        request: 'analyze_current_portfolio',
        includeOpportunities: true,
        focusAreas: ['Healthcare Tech', 'AI/ML', 'Performance Engineering']
      },
      'ANALYZE_OPPORTUNITIES'
    );
    
    await this.wait(500);
    
    // Scenario 2: Evolution Optimization Request
    console.log('🧬 Scenario 2: Requesting Strategy Optimization');
    this.initializer.communicationHub.sendMessage(
      'Claude-Builder-001',
      'Evolution-Prime-001',
      {
        solutionId: 'portfolio_strategy_v1',
        optimizationTarget: 'interview_conversion_rate',
        currentMetrics: {
          applicationSuccessRate: 65,
          interviewConversionRate: 45,
          portfolioStrength: 85
        }
      },
      'OPTIMIZATION_REQUEST'
    );
    
    await this.wait(500);
    
    // Scenario 3: Cross-Agent Collaboration
    console.log('🤝 Scenario 3: Initiating Cross-Agent Collaboration');
    this.initializer.communicationHub.sendMessage(
      'Marketing-Strategist-001',
      'Evolution-Prime-001',
      {
        proposalId: 'marketing_strategy_alpha',
        strategy: {
          targetSector: 'Healthcare Technology',
          keyProjects: ['NeuroCalc'],
          proposedApproach: 'Technical depth demonstration with domain expertise focus'
        },
        requestType: 'fitness_evaluation_and_improvement'
      },
      'SOLUTION_PROPOSED'
    );
    
    await this.wait(1000);
    
    console.log('✅ Communication demonstration complete\n');
  }

  async startCollaborativeWork() {
    console.log('🔄 Starting Collaborative Work Session...\n');
    
    // Builder coordinates the work
    this.initializer.coordinateAgents({
      task: 'optimize_marketing_strategy',
      priority: 'high',
      expectedOutcome: 'Improved job application success rate'
    });
    
    await this.wait(1000);
    
    // Show system status
    this.displaySystemStatus();
    
    // Start continuous collaboration
    this.startContinuousCollaboration();
  }

  startContinuousCollaboration() {
    console.log('♾️  Starting continuous collaboration loop...\n');
    
    setInterval(() => {
      this.runCollaborationCycle();
    }, 5000); // Run collaboration cycle every 5 seconds
  }

  runCollaborationCycle() {
    const cycles = [
      () => this.marketingAnalysisCycle(),
      () => this.evolutionOptimizationCycle(),
      () => this.crossAgentSynthesisCycle()
    ];
    
    const randomCycle = cycles[Math.floor(Math.random() * cycles.length)];
    randomCycle();
  }

  marketingAnalysisCycle() {
    console.log('📈 Marketing Analysis Cycle');
    this.initializer.communicationHub.sendMessage(
      'Claude-Builder-001',
      'Marketing-Strategist-001',
      {
        cycleType: 'continuous_improvement',
        analysisRequest: 'portfolio_optimization',
        timestamp: Date.now()
      },
      'CONTINUOUS_ANALYSIS'
    );
  }

  evolutionOptimizationCycle() {
    console.log('🧬 Evolution Optimization Cycle');
    this.initializer.communicationHub.sendMessage(
      'Claude-Builder-001',
      'Evolution-Prime-001',
      {
        cycleType: 'fitness_improvement',
        mutationTarget: 'application_strategy',
        timestamp: Date.now()
      },
      'CONTINUOUS_OPTIMIZATION'
    );
  }

  crossAgentSynthesisCycle() {
    console.log('🔗 Cross-Agent Synthesis Cycle');
    
    // Marketing to Evolution
    this.initializer.communicationHub.sendMessage(
      'Marketing-Strategist-001',
      'Evolution-Prime-001',
      {
        synthesisRequest: 'strategy_fitness_evaluation',
        newStrategy: this.generateRandomStrategy(),
        timestamp: Date.now()
      },
      'SYNTHESIS_REQUEST'
    );
    
    // Evolution to Marketing
    this.initializer.communicationHub.sendMessage(
      'Evolution-Prime-001',
      'Marketing-Strategist-001',
      {
        optimizationResults: 'strategy_improvement_suggestions',
        improvedMetrics: this.generateRandomMetrics(),
        timestamp: Date.now()
      },
      'OPTIMIZATION_RESULTS'
    );
  }

  generateRandomStrategy() {
    const strategies = [
      'Technical depth showcase with performance metrics',
      'Domain expertise demonstration through project deep-dives',
      'Innovation narrative with problem-solving examples',
      'Cross-platform capability demonstration',
      'Collaborative development evidence presentation'
    ];
    
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  generateRandomMetrics() {
    return {
      applicationSuccessRate: Math.floor(Math.random() * 30) + 60,
      interviewConversionRate: Math.floor(Math.random() * 25) + 50,
      networkGrowthRate: Math.floor(Math.random() * 20) + 30,
      portfolioStrength: Math.floor(Math.random() * 15) + 80
    };
  }

  displaySystemStatus() {
    const status = this.initializer.getSystemStatus();
    console.log('📊 System Status:');
    console.log(`   Active Agents: ${status.activeAgents}`);
    console.log(`   Messages Exchanged: ${status.totalMessagesExchanged}`);
    console.log(`   Queue Length: ${status.messageQueueLength}`);
    console.log(`   System Uptime: ${Math.round(status.systemUptime / 1000)}s\n`);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the demo if run directly
if (require.main === module) {
  const demo = new AgentEcosystemDemo();
  demo.start().catch(console.error);
}

module.exports = {
  AgentEcosystemDemo
};