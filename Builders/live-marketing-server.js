#!/usr/bin/env node

/**
 * Live Marketing Server - Real-time Agent Coordination Demo
 * Serves marketing demos with live agent communication updates
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const { communicationHub } = require('./agent-communication.js');

class LiveMarketingServer {
  constructor(port = 3000) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.connectedClients = new Map();
    this.messageHistory = [];
    this.maxHistorySize = 100;
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupAgentIntegration();
  }
  
  setupMiddleware() {
    // Serve static files
    this.app.use(express.static(__dirname));
    this.app.use(express.json());
    
    // CORS headers
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }
  
  setupRoutes() {
    // Main portfolio route
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'portfolio-constellation.html'));
    });
    
    // Agent collaboration demo
    this.app.get('/agents', (req, res) => {
      res.sendFile(path.join(__dirname, 'agent-collaboration-demo.html'));
    });
    
    // List all available demos
    this.app.get('/demos', (req, res) => {
      const htmlFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.html'))
        .map(file => ({
          name: file.replace('.html', ''),
          url: `/${file}`,
          title: this.extractTitle(file)
        }));
      
      res.json({
        demos: htmlFiles,
        totalDemos: htmlFiles.length,
        server: 'Live Marketing Server',
        agentNetwork: 'Active'
      });
    });
    
    // Agent network status
    this.app.get('/api/agents', (req, res) => {
      const metrics = communicationHub.getCollaborationMetrics();
      res.json({
        ...metrics,
        connectedClients: this.connectedClients.size,
        messageHistory: this.messageHistory.slice(-10) // Last 10 messages
      });
    });
    
    // Live message stream
    this.app.get('/api/messages/stream', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      
      // Send recent messages
      this.messageHistory.slice(-5).forEach(msg => {
        res.write(`data: ${JSON.stringify(msg)}\\n\\n`);
      });
      
      // Keep connection alive
      const heartbeat = setInterval(() => {
        res.write(`data: {"type": "heartbeat", "timestamp": ${Date.now()}}\\n\\n`);
      }, 30000);
      
      req.on('close', () => {
        clearInterval(heartbeat);
      });
    });
    
    // Viewer analytics endpoint
    this.app.post('/api/analytics/track', (req, res) => {
      const { event, data, viewerType } = req.body;
      
      this.broadcastToClients('viewer_analytics', {
        event,
        data,
        viewerType,
        timestamp: Date.now()
      });
      
      res.json({ status: 'tracked', event, timestamp: Date.now() });
    });
  }
  
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 Client connected: ${socket.id}`);
      
      // Store client info
      this.connectedClients.set(socket.id, {
        id: socket.id,
        connectedAt: Date.now(),
        viewerType: 'unknown',
        interactions: 0
      });
      
      // Send recent message history
      socket.emit('message_history', this.messageHistory.slice(-20));
      
      // Handle viewer type detection
      socket.on('viewer_detected', (data) => {
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.viewerType = data.type;
          client.confidence = data.confidence;
          
          this.broadcastToClients('viewer_update', {
            clientId: socket.id,
            viewerType: data.type,
            confidence: data.confidence,
            timestamp: Date.now()
          });
        }
      });
      
      // Handle interaction tracking
      socket.on('interaction', (data) => {
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.interactions++;
          client.lastInteraction = Date.now();
          
          this.broadcastToClients('interaction_tracked', {
            clientId: socket.id,
            interaction: data,
            totalInteractions: client.interactions,
            timestamp: Date.now()
          });
        }
      });
      
      // Handle agent message injection
      socket.on('send_agent_message', (data) => {
        this.injectAgentMessage(data.from, data.to, data.content, data.type);
      });
      
      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
        
        this.broadcastToClients('client_disconnected', {
          clientId: socket.id,
          timestamp: Date.now()
        });
      });
    });
  }
  
  setupAgentIntegration() {
    // Hook into the agent communication system
    const originalSendMessage = communicationHub.sendMessage.bind(communicationHub);
    
    communicationHub.sendMessage = (from, to, message, messageType = 'GENERAL') => {
      // Call original method
      const messageId = originalSendMessage(from, to, message, messageType);
      
      // Broadcast to connected clients
      const agentMessage = {
        id: messageId,
        from,
        to,
        type: messageType,
        content: message,
        timestamp: Date.now()
      };
      
      this.addToHistory(agentMessage);
      this.broadcastToClients('agent_message', agentMessage);
      
      return messageId;
    };
    
    // Hook into broadcast messages
    const originalBroadcast = communicationHub.broadcast.bind(communicationHub);
    
    communicationHub.broadcast = (message) => {
      originalBroadcast(message);
      
      const broadcastMessage = {
        ...message,
        timestamp: message.timestamp || Date.now(),
        isBroadcast: true
      };
      
      this.addToHistory(broadcastMessage);
      this.broadcastToClients('agent_broadcast', broadcastMessage);
    };
    
    console.log('🤖 Agent communication system integrated');
  }
  
  extractTitle(filename) {
    const titleMap = {
      'portfolio-constellation.html': 'Portfolio Constellation',
      'agent-collaboration-demo.html': 'Live Agent Collaboration',
      '3d-visualization-demo.html': '3D Visualization Showcase',
      'adaptive-skills-showcase.html': 'Adaptive Skills Demo',
      'interactive-timeline.html': 'Interactive Timeline',
      'realtime-metrics-dashboard.html': 'Real-time Metrics',
      'live-marketing-demo.html': 'Live Marketing Demo',
      'themed-agent-demo.html': 'Themed Agent System',
      'index.html': 'Main Dashboard'
    };
    
    return titleMap[filename] || filename.replace('.html', '').replace(/-/g, ' ');
  }
  
  addToHistory(message) {
    this.messageHistory.push(message);
    
    // Keep history size manageable
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistorySize);
    }
  }
  
  broadcastToClients(event, data) {
    this.io.emit(event, data);
  }
  
  injectAgentMessage(from, to, content, type = 'INJECTED_MESSAGE') {
    return communicationHub.sendMessage(from, to, content, type);
  }
  
  getServerStats() {
    return {
      port: this.port,
      connectedClients: this.connectedClients.size,
      messageHistory: this.messageHistory.length,
      agentNetwork: communicationHub.getCollaborationMetrics(),
      uptime: process.uptime()
    };
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
🚀 Live Marketing Server Started!
📡 Server: http://localhost:${this.port}
🎯 Portfolio: http://localhost:${this.port}/
🤖 Agents: http://localhost:${this.port}/agents
📊 Demos: http://localhost:${this.port}/demos
🔗 API: http://localhost:${this.port}/api/agents

💫 Project Constellation is LIVE with real-time agent coordination!
      `);
      
      // Send initial agent announcements
      setTimeout(() => {
        communicationHub.sendMessage(
          'Server',
          'ALL',
          'Live Marketing Server is online! All demos now have real-time agent coordination. Employers can watch 55+ agents collaborating live while exploring the portfolio!',
          'SYSTEM_ANNOUNCEMENT'
        );
      }, 1000);
    });
  }
  
  stop() {
    this.server.close(() => {
      console.log('📴 Live Marketing Server stopped');
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new LiveMarketingServer(process.env.PORT || 3000);
  server.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down Live Marketing Server...');
    server.stop();
    process.exit(0);
  });
}

module.exports = { LiveMarketingServer };