#!/usr/bin/env node

/**
 * Live Agent Conversation Viewer
 * A human-friendly way to follow the 55-agent network in real-time
 */

const { spawn } = require('child_process');
const readline = require('readline');

class LiveLogViewer {
  constructor() {
    this.agentColors = {
      'Builder': '\x1b[36m',      // Cyan
      'Synthesizer': '\x1b[35m',  // Magenta  
      'Catalyst': '\x1b[33m',     // Yellow
      'Orchestrator': '\x1b[32m', // Green
      'Marketer': '\x1b[31m',     // Red
      'Architect': '\x1b[34m',    // Blue
      'SYSTEM': '\x1b[37m'        // White
    };
    this.reset = '\x1b[0m';
    this.messageCount = 0;
    this.startTime = Date.now();
    this.statusUpdates = [];
  }

  formatMessage(line) {
    // Extract agent names and message types from log lines
    const conversationMatch = line.match(/CONVERSATION LOG: \[([^\]]+)\] (\w+) -> (\w+) \((\w+)\): (.+)/);
    const statusMatch = line.match(/🤖 AGENT STATUS UPDATE: (.+)/);
    
    if (conversationMatch) {
      const [, timestamp, from, to, type, content] = conversationMatch;
      const fromColor = this.agentColors[from] || '\x1b[37m';
      const toColor = this.agentColors[to] || '\x1b[37m';
      
      this.messageCount++;
      
      return `${fromColor}${from}${this.reset} → ${toColor}${to}${this.reset} [${type}]\n` +
             `  💬 ${content.substring(0, 120)}${content.length > 120 ? '...' : ''}\n`;
             
    } else if (statusMatch) {
      const statusText = statusMatch[1];
      const agentMatch = statusText.match(/^(\w+): (.+)/);
      
      if (agentMatch) {
        const [, agent, status] = agentMatch;
        const agentColor = this.agentColors[agent] || '\x1b[37m';
        
        this.statusUpdates.push({ agent, status, time: Date.now() });
        
        return `${agentColor}⚡ ${agent}${this.reset}: ${status}\n`;
      }
    }
    
    return null;
  }

  showStats() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const rate = Math.floor(this.messageCount / (elapsed || 1));
    
    console.log(`\n📊 ${this.messageCount} messages | ${elapsed}s elapsed | ${rate} msg/s\n`);
  }

  showHelp() {
    console.log(`
🤖 Agent Communication Live Viewer
═══════════════════════════════════

Controls:
  SPACE - Pause/Resume
  S     - Show stats
  H     - Show this help
  Q     - Quit

Agent Colors:
  ${this.agentColors.Builder}Builder${this.reset}      - Architecture & Core Systems
  ${this.agentColors.Synthesizer}Synthesizer${this.reset} - Adaptive Intelligence  
  ${this.agentColors.Catalyst}Catalyst${this.reset}     - Rapid Prototyping
  ${this.agentColors.Orchestrator}Orchestrator${this.reset} - Network Coordination
  ${this.agentColors.Marketer}Marketer${this.reset}     - Marketing Strategy
  ${this.agentColors.Architect}Architect${this.reset}    - Microservices Design

Project: "Adaptive Portfolio Constellation"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }

  start() {
    console.clear();
    this.showHelp();
    
    // Start the agent communication system
    const agentProcess = spawn('node', ['agent-communication.js'], {
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let isPaused = false;

    // Handle agent output
    agentProcess.stdout.on('data', (data) => {
      if (isPaused) return;
      
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        const formatted = this.formatMessage(line);
        if (formatted) {
          process.stdout.write(formatted);
        }
      });
    });

    agentProcess.stderr.on('data', (data) => {
      if (!isPaused) {
        console.error(`Error: ${data}`);
      }
    });

    // Handle keyboard input
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (chunk, key) => {
      if (!key) return;

      switch (key.name) {
        case 'space':
          isPaused = !isPaused;
          console.log(isPaused ? '\n⏸️  PAUSED' : '\n▶️  RESUMED');
          break;
          
        case 's':
          this.showStats();
          break;
          
        case 'h':
          console.clear();
          this.showHelp();
          break;
          
        case 'q':
        case 'escape':
          console.log('\n👋 Goodbye! Agents continue working...');
          agentProcess.kill();
          process.exit(0);
          break;
          
        case 'c':
          if (key.ctrl) {
            console.log('\n👋 Goodbye! Agents continue working...');
            agentProcess.kill();
            process.exit(0);
          }
          break;
      }
    });

    // Show periodic stats
    setInterval(() => {
      if (!isPaused) {
        this.showStats();
      }
    }, 30000);

    agentProcess.on('close', (code) => {
      console.log(`\nAgent communication system exited with code ${code}`);
      process.exit(code);
    });
  }
}

// Start the viewer if run directly
if (require.main === module) {
  const viewer = new LiveLogViewer();
  viewer.start();
}

module.exports = LiveLogViewer;