class AgentDemo {
    constructor() {
        this.messages = [];
        this.messageCount = 0;
        this.startTime = Date.now();
        this.isPaused = false;
        this.agents = ['Builder', 'Synthesizer', 'Catalyst', 'Orchestrator', 'Visionary'];
        
        this.messageTypes = [
            'COORDINATION',
            'ARCHITECTURE', 
            'PROTOTYPING',
            'INTELLIGENCE',
            'STRATEGY',
            'INNOVATION'
        ];
        
        this.sampleMessages = [
            'Adaptive intelligence pipeline optimized!',
            'Core platform architecture ready!',
            'Behavioral analytics prototype complete!',
            'Real-time coordination active!',
            'Live demonstration system operational!',
            'Interactive marketing demos ready!',
            'Adaptive presentation engine online!',
            'Revolutionary capabilities showcased!'
        ];
        
        this.themes = {
            'cyberpunk': 'theme-cyberpunk',
            'corporate': 'theme-corporate', 
            'minimal': 'theme-minimal',
            'synthwave': 'theme-synthwave',
            'startup': 'theme-startup'
        };
        
        this.init();
    }
    
    init() {
        this.setupThemeSelector();
        this.updateStats();
        this.startMessageGeneration();
        setInterval(() => this.updateStats(), 1000);
        this.applyTheme('cyberpunk');
    }
    
    setupThemeSelector() {
        const selector = document.getElementById('themeSelector');
        selector.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }
    
    applyTheme(themeId) {
        // Remove existing theme classes
        Object.values(this.themes).forEach(theme => {
            document.body.classList.remove(theme);
        });
        
        // Apply new theme
        if (this.themes[themeId]) {
            document.body.classList.add(this.themes[themeId]);
        }
        
        // Add theme change message
        this.addSystemMessage(`Theme changed to ${themeId.charAt(0).toUpperCase() + themeId.slice(1)}`);
    }
    
    generateMessage() {
        if (this.isPaused) return;
        
        const from = this.agents[Math.floor(Math.random() * this.agents.length)];
        const to = this.agents[Math.floor(Math.random() * this.agents.length)];
        const type = this.messageTypes[Math.floor(Math.random() * this.messageTypes.length)];
        const content = this.sampleMessages[Math.floor(Math.random() * this.sampleMessages.length)];
        
        this.addMessage({ from, to, type, content });
        
        // Occasionally add status updates
        if (Math.random() < 0.3) {
            setTimeout(() => this.addStatusUpdate(), 500);
        }
    }
    
    addMessage(message) {
        this.messages.push(message);
        this.messageCount++;
        
        const feed = document.getElementById('feed');
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-route">${message.from} → ${message.to}</span>
                <span class="message-type">${message.type}</span>
            </div>
            <div class="message-content">${message.content}</div>
        `;
        
        feed.appendChild(messageEl);
        feed.scrollTop = feed.scrollHeight;
        
        // Keep only last 30 messages
        if (feed.children.length > 30) {
            feed.removeChild(feed.firstChild);
        }
    }
    
    addSystemMessage(content) {
        const feed = document.getElementById('feed');
        const messageEl = document.createElement('div');
        messageEl.className = 'system-msg';
        messageEl.innerHTML = `⚡ ${content}`;
        
        feed.appendChild(messageEl);
        feed.scrollTop = feed.scrollHeight;
    }
    
    addStatusUpdate() {
        if (this.isPaused) return;
        
        const agent = this.agents[Math.floor(Math.random() * this.agents.length)];
        const updates = [
            'Pattern recognition optimized!',
            'Architecture scaling complete!',
            'Prototype cycle finished!',
            'Coordination synchronized!',
            'Strategic breakthrough achieved!',
            'Innovation protocols engaged!'
        ];
        
        const status = updates[Math.floor(Math.random() * updates.length)];
        this.addSystemMessage(`${agent}: ${status}`);
    }
    
    updateStats() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('messageCount').textContent = this.messageCount;
        document.getElementById('uptime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    startMessageGeneration() {
        setInterval(() => {
            this.generateMessage();
        }, 2000 + Math.random() * 3000);
    }
    
    pause() {
        this.isPaused = !this.isPaused;
        const btn = document.querySelector('.controls button');
        btn.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
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
}

// Global functions
let demo;

function togglePause() {
    demo.pause();
}

function clearFeed() {
    demo.clear();
}

function randomTheme() {
    demo.randomTheme();
}

// Initialize when page loads
window.addEventListener('load', () => {
    demo = new AgentDemo();
    
    // Add some initial messages
    setTimeout(() => demo.addSystemMessage('Orchestrator: Network coordination active'), 1000);
    setTimeout(() => demo.addSystemMessage('Builder: Platform architecture ready'), 2000);
    setTimeout(() => demo.addSystemMessage('Synthesizer: Intelligence systems online'), 3000);
});