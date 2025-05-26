class EnhancedAgentDemo {
    constructor() {
        this.messages = [];
        this.messageCount = 0;
        this.startTime = Date.now();
        this.isPaused = false;
        this.currentMode = 'live'; // 'live', 'replay', 'hybrid'
        
        this.agents = [
            { name: 'Builder', emoji: '🏗️', specialty: 'Architecture', status: 'Coordinating microservices' },
            { name: 'Synthesizer', emoji: '🧠', specialty: 'Intelligence', status: '80ms adaptive pipeline' },
            { name: 'Catalyst', emoji: '⚡', specialty: 'Prototyping', status: 'Rapid iteration cycles' },
            { name: 'Orchestrator', emoji: '🎭', specialty: 'Coordination', status: '55+ agent network' },
            { name: 'Visionary', emoji: '👁️', specialty: 'Strategy', status: 'Revolutionary planning' },
            { name: 'Phoenix', emoji: '🔥', specialty: 'Evolution', status: 'System optimization' },
            { name: 'Nexus', emoji: '🔗', specialty: 'Integration', status: 'Connection bridges' },
            { name: 'Designer', emoji: '🎨', specialty: 'Visual', status: '16 theme mastery' }
        ];
        
        // Load real conversations from data file
        this.conversationCategories = ['deployment', 'architecture', 'intelligence', 'innovation', 'coordination', 'design', 'marketing'];
        this.currentCategory = 0;
        
        // Status updates from real agent activities
        this.statusUpdates = [
            'Builder: Microservices architecture deployment ready with theme integration!',
            'Synthesizer: Adaptive intelligence systems online with visual coordination!',
            'Catalyst: Advanced behavior analysis integrated with real-time testing!',
            'Orchestrator: All agents coordinating deployment at maximum velocity!',
            'Visionary: We\'re making history - first-ever live multi-agent development!',
            'Phoenix: Evolution in progress! All systems optimizing in real-time!',
            'Nexus: All connections operational! 3D visualization and live feeds active!',
            'Designer: Emergency UI/UX collaboration - this is REAL LIVE MARKETING!'
        ];
        
        this.projectMilestones = [
            'Project Constellation initialization complete',
            'Multi-agent communication protocols established',
            'Adaptive intelligence pipeline operational',
            'Real-time coordination at 55+ agent scale',
            'Behavioral biometrics breakthrough achieved',
            'Enterprise-grade deployment successful',
            'Global CDN distribution active',
            'Revolutionary marketing demonstration live'
        ];
        
        this.themes = {
            'cyberpunk': { 
                name: 'Cyberpunk Hacker', 
                target: 'Senior Engineers, Tech Innovators',
                mood: 'Edgy, cutting-edge, innovative'
            },
            'corporate': { 
                name: 'Corporate Executive', 
                target: 'CTOs, Engineering Managers',
                mood: 'Professional, reliable, scalable'
            },
            'minimal': { 
                name: 'Minimalist Clean', 
                target: 'Design-conscious teams',
                mood: 'Clean, focused, elegant'
            },
            'synthwave': { 
                name: 'Synthwave Future', 
                target: 'Creative technologists',
                mood: 'Retro-futuristic, bold, artistic'
            },
            'startup': { 
                name: 'Startup Energy', 
                target: 'Founders, early-stage teams',
                mood: 'Dynamic, agile, growth-focused'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupThemeSelector();
        this.setupModeSelector();
        this.renderAgentGrid();
        this.updateStats();
        this.startMessageGeneration();
        this.startMilestoneTracking();
        setInterval(() => this.updateStats(), 1000);
        this.applyTheme('cyberpunk');
        
        // Add initial system message
        this.addSystemMessage('🚀 Project Constellation Online - Revolutionary multi-agent collaboration active');
    }
    
    setupModeSelector() {
        const controls = document.querySelector('.controls');
        const modeSelector = document.createElement('select');
        modeSelector.id = 'modeSelector';
        modeSelector.innerHTML = `
            <option value="live">Live Demo</option>
            <option value="replay">Real Conversations</option>
            <option value="hybrid">Hybrid Mode</option>
        `;
        modeSelector.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.addSystemMessage(`Mode switched to: ${e.target.value}`);
        });
        controls.appendChild(modeSelector);
    }
    
    renderAgentGrid() {
        const agentsContainer = document.querySelector('.agents');
        agentsContainer.innerHTML = '';
        
        this.agents.forEach(agent => {
            const agentEl = document.createElement('div');
            agentEl.className = 'agent';
            agentEl.innerHTML = `
                <div class="agent-name">${agent.emoji} ${agent.name}</div>
                <div class="agent-specialty">${agent.specialty}</div>
                <div class="agent-status">${agent.status}</div>
                <div class="agent-activity"></div>
            `;
            agentsContainer.appendChild(agentEl);
        });
    }
    
    setupThemeSelector() {
        const selector = document.getElementById('themeSelector');
        
        // Clear existing options and add theme-rich options
        selector.innerHTML = '';
        Object.keys(this.themes).forEach(themeId => {
            const option = document.createElement('option');
            option.value = themeId;
            option.textContent = this.themes[themeId].name;
            selector.appendChild(option);
        });
        
        selector.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }
    
    applyTheme(themeId) {
        // Remove existing theme classes
        Object.keys(this.themes).forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
        });
        
        // Apply new theme
        if (this.themes[themeId]) {
            document.body.classList.add(`theme-${themeId}`);
            
            // Update theme info display
            const themeInfo = this.themes[themeId];
            const themeDisplay = document.querySelector('.theme-display') || this.createThemeDisplay();
            themeDisplay.innerHTML = `
                <div class="current-theme-name">${themeInfo.name}</div>
                <div class="current-theme-target">${themeInfo.target}</div>
                <div class="current-theme-mood">${themeInfo.mood}</div>
            `;
            
            this.addSystemMessage(`Theme adapted: ${themeInfo.name} for ${themeInfo.target}`);
        }
    }
    
    createThemeDisplay() {
        const display = document.createElement('div');
        display.className = 'theme-display';
        document.body.appendChild(display);
        return display;
    }
    
    generateMessage() {
        if (this.isPaused) return;
        
        let message;
        
        switch (this.currentMode) {
            case 'replay':
                message = this.getReplayMessage();
                break;
            case 'hybrid':
                message = Math.random() < 0.7 ? this.getReplayMessage() : this.generateLiveMessage();
                break;
            default:
                message = this.generateLiveMessage();
        }
        
        this.addMessage(message);
        
        // Add status updates occasionally
        if (Math.random() < 0.4) {
            setTimeout(() => this.addRandomStatusUpdate(), 500 + Math.random() * 2000);
        }
    }
    
    getReplayMessage() {
        // Cycle through different conversation categories for variety
        if (typeof REAL_CONVERSATIONS !== 'undefined') {
            const category = this.conversationCategories[this.currentCategory];
            const conversations = REAL_CONVERSATIONS[category];
            
            if (conversations && conversations.length > 0) {
                const message = conversations[Math.floor(Math.random() * conversations.length)];
                this.currentCategory = (this.currentCategory + 1) % this.conversationCategories.length;
                return message;
            }
        }
        
        // Fallback to built-in conversations
        const fallbackConversations = [
            {
                from: 'Builder',
                to: 'Orchestrator',
                type: 'ARCHITECTURE_COORDINATION',
                content: 'Core platform API framework 85% complete - plugin architecture ready!'
            },
            {
                from: 'Synthesizer',
                to: 'Catalyst',
                type: 'INTELLIGENCE_BREAKTHROUGH',
                content: 'Adaptive intelligence pipeline optimized to 80ms response time!'
            }
        ];
        
        return fallbackConversations[Math.floor(Math.random() * fallbackConversations.length)];
    }
    
    generateLiveMessage() {
        const fromAgent = this.agents[Math.floor(Math.random() * this.agents.length)];
        const toAgent = this.agents[Math.floor(Math.random() * this.agents.length)];
        
        const messageTypes = [
            'ARCHITECTURE_COORDINATION',
            'INTELLIGENCE_ANALYSIS', 
            'RAPID_PROTOTYPING',
            'STRATEGIC_PLANNING',
            'SYSTEM_EVOLUTION',
            'VISUAL_INNOVATION',
            'INTEGRATION_BRIDGE',
            'COORDINATION_SYNC'
        ];
        
        const dynamicContent = [
            `${fromAgent.specialty} optimization achieving breakthrough performance!`,
            `Cross-agent coordination with ${toAgent.name} reaching new efficiency levels!`,
            `Real-time ${fromAgent.specialty.toLowerCase()} algorithms adapting to user behavior!`,
            `Integration bridge between ${fromAgent.specialty} and ${toAgent.specialty} established!`,
            `Advanced ${fromAgent.specialty.toLowerCase()} protocols engaging for maximum impact!`
        ];
        
        return {
            from: fromAgent.name,
            to: toAgent.name,
            type: messageTypes[Math.floor(Math.random() * messageTypes.length)],
            content: dynamicContent[Math.floor(Math.random() * dynamicContent.length)]
        };
    }
    
    addMessage(message) {
        this.messages.push(message);
        this.messageCount++;
        
        const feed = document.getElementById('feed');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.from.toLowerCase()}`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-route">${message.from} → ${message.to}</span>
                <span class="message-type">${message.type}</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${message.content}</div>
        `;
        
        feed.appendChild(messageEl);
        feed.scrollTop = feed.scrollHeight;
        
        // Keep feed manageable
        if (feed.children.length > 40) {
            feed.removeChild(feed.firstChild);
        }
        
        // Update agent activity indicators
        this.updateAgentActivity(message.from);
    }
    
    updateAgentActivity(agentName) {
        const agentCards = document.querySelectorAll('.agent');
        agentCards.forEach(card => {
            const nameEl = card.querySelector('.agent-name');
            if (nameEl && nameEl.textContent.includes(agentName)) {
                const activity = card.querySelector('.agent-activity');
                if (activity) {
                    activity.style.animation = 'none';
                    activity.offsetHeight; // Trigger reflow
                    activity.style.animation = 'pulse 1s ease-in-out';
                }
            }
        });
    }
    
    addRandomStatusUpdate() {
        if (this.isPaused) return;
        
        const status = this.statusUpdates[Math.floor(Math.random() * this.statusUpdates.length)];
        this.addSystemMessage(status);
    }
    
    addSystemMessage(content) {
        const feed = document.getElementById('feed');
        const messageEl = document.createElement('div');
        messageEl.className = 'system-msg';
        messageEl.innerHTML = `⚡ ${content}`;
        
        feed.appendChild(messageEl);
        feed.scrollTop = feed.scrollHeight;
    }
    
    startMilestoneTracking() {
        let milestoneIndex = 0;
        
        setInterval(() => {
            if (milestoneIndex < this.projectMilestones.length && !this.isPaused) {
                this.addSystemMessage(`🎯 Milestone: ${this.projectMilestones[milestoneIndex]}`);
                milestoneIndex++;
            }
        }, 30000); // Every 30 seconds
    }
    
    updateStats() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const msgRate = Math.floor(this.messageCount / Math.max(elapsed / 60, 1));
        
        document.getElementById('messageCount').textContent = this.messageCount;
        document.getElementById('activeAgents').textContent = this.agents.length;
        document.getElementById('uptime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
        // Add message rate if element exists
        const msgRateEl = document.getElementById('msgRate');
        if (msgRateEl) {
            msgRateEl.textContent = msgRate;
        }
    }
    
    startMessageGeneration() {
        // Variable timing based on mode
        const getInterval = () => {
            switch (this.currentMode) {
                case 'replay': return 1500 + Math.random() * 2000;
                case 'hybrid': return 2000 + Math.random() * 3000;
                default: return 3000 + Math.random() * 4000;
            }
        };
        
        const generateNext = () => {
            this.generateMessage();
            setTimeout(generateNext, getInterval());
        };
        
        setTimeout(generateNext, 2000);
    }
    
    pause() {
        this.isPaused = !this.isPaused;
        const btn = document.querySelector('.controls button');
        btn.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
        
        this.addSystemMessage(this.isPaused ? 'System paused' : 'System resumed');
    }
    
    clear() {
        document.getElementById('feed').innerHTML = 
            '<div class="system-msg">🗑️ Feed cleared - ready for new conversations</div>';
        this.messageCount = 0;
        this.messages = [];
    }
    
    randomTheme() {
        const themeKeys = Object.keys(this.themes);
        const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        document.getElementById('themeSelector').value = randomTheme;
        this.applyTheme(randomTheme);
    }
    
    exportSession() {
        const sessionData = {
            timestamp: new Date().toISOString(),
            mode: this.currentMode,
            messageCount: this.messageCount,
            uptime: Date.now() - this.startTime,
            agents: this.agents.length,
            messages: this.messages.slice(-20), // Last 20 messages
            currentTheme: document.getElementById('themeSelector').value
        };
        
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-constellation-session-${Date.now()}.json`;
        a.click();
        
        this.addSystemMessage('Session data exported successfully');
    }
}

// Global functions
let demo;

function togglePause() { demo.pause(); }
function clearFeed() { demo.clear(); }
function randomTheme() { demo.randomTheme(); }
function exportSession() { demo.exportSession(); }

// Initialize enhanced demo
window.addEventListener('load', () => {
    demo = new EnhancedAgentDemo();
    
    // Add export button to controls
    const controls = document.querySelector('.controls');
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '💾 Export';
    exportBtn.onclick = exportSession;
    controls.appendChild(exportBtn);
    
    // Initial agent status messages
    setTimeout(() => demo.addSystemMessage('Orchestrator: 55+ agent network coordination active'), 1000);
    setTimeout(() => demo.addSystemMessage('Builder: Platform architecture deployment ready'), 2500);
    setTimeout(() => demo.addSystemMessage('Synthesizer: Adaptive intelligence systems online'), 4000);
    setTimeout(() => demo.addSystemMessage('All systems: Project Constellation fully operational'), 6000);
});