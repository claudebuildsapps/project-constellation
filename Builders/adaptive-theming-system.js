/**
 * Adaptive Portfolio Theming System
 * Creates 20+ visual themes with real-time viewer adaptation
 */

class AdaptiveThemingSystem {
  constructor() {
    this.themes = new Map();
    this.viewerAnalytics = new Map();
    this.activeTheme = 'default';
    this.adaptationRules = new Map();
    this.themePerformanceMetrics = new Map();
    
    this.initializeThemes();
    this.setupAdaptationRules();
  }

  initializeThemes() {
    // Corporate & Professional Themes
    this.addTheme('corporate-clean', {
      name: 'Corporate Clean',
      category: 'professional',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        text: '#1e293b',
        surface: '#f8fafc'
      },
      typography: {
        fontFamily: '"Inter", system-ui, sans-serif',
        headingScale: 1.25,
        lineHeight: 1.6,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'generous',
        borderRadius: '8px',
        shadows: 'subtle',
        animations: 'minimal'
      },
      personality: 'Professional, trustworthy, enterprise-ready'
    });

    this.addTheme('executive-dark', {
      name: 'Executive Dark',
      category: 'professional',
      colors: {
        primary: '#8b5cf6',
        secondary: '#6b7280',
        accent: '#10b981',
        background: '#0f172a',
        text: '#f1f5f9',
        surface: '#1e293b'
      },
      typography: {
        fontFamily: '"SF Pro", system-ui, sans-serif',
        headingScale: 1.3,
        lineHeight: 1.7,
        letterSpacing: 'tight'
      },
      layout: {
        spacing: 'comfortable',
        borderRadius: '12px',
        shadows: 'dramatic',
        animations: 'smooth'
      },
      personality: 'Sophisticated, powerful, premium'
    });

    // Tech & Developer Themes
    this.addTheme('cyberpunk-neon', {
      name: 'Cyberpunk Neon',
      category: 'tech',
      colors: {
        primary: '#00f5ff',
        secondary: '#ff2079',
        accent: '#39ff14',
        background: '#0a0a0a',
        text: '#00f5ff',
        surface: '#1a1a2e'
      },
      typography: {
        fontFamily: '"Fira Code", "SF Mono", monospace',
        headingScale: 1.4,
        lineHeight: 1.5,
        letterSpacing: 'wide'
      },
      layout: {
        spacing: 'tight',
        borderRadius: '4px',
        shadows: 'neon-glow',
        animations: 'dynamic'
      },
      personality: 'Futuristic, edgy, high-tech hacker aesthetic'
    });

    this.addTheme('terminal-matrix', {
      name: 'Terminal Matrix',
      category: 'tech',
      colors: {
        primary: '#00ff41',
        secondary: '#008f11',
        accent: '#00ff41',
        background: '#000000',
        text: '#00ff41',
        surface: '#001100'
      },
      typography: {
        fontFamily: '"Courier New", "SF Mono", monospace',
        headingScale: 1.2,
        lineHeight: 1.4,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'minimal',
        borderRadius: '0px',
        shadows: 'none',
        animations: 'typing'
      },
      personality: 'Classic hacker, retro computing, matrix-style'
    });

    this.addTheme('github-dev', {
      name: 'GitHub Developer',
      category: 'tech',
      colors: {
        primary: '#238636',
        secondary: '#656d76',
        accent: '#0969da',
        background: '#ffffff',
        text: '#24292f',
        surface: '#f6f8fa'
      },
      typography: {
        fontFamily: '"GitHub Sans", system-ui, sans-serif',
        headingScale: 1.25,
        lineHeight: 1.6,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'standard',
        borderRadius: '6px',
        shadows: 'github',
        animations: 'subtle'
      },
      personality: 'Developer-focused, familiar, open-source'
    });

    // Creative & Artistic Themes
    this.addTheme('retro-80s', {
      name: 'Retro 80s',
      category: 'creative',
      colors: {
        primary: '#ff6b9d',
        secondary: '#c44569',
        accent: '#f8b500',
        background: '#2d1b69',
        text: '#ffffff',
        surface: '#40407a'
      },
      typography: {
        fontFamily: '"Orbitron", sci-fi, sans-serif',
        headingScale: 1.5,
        lineHeight: 1.5,
        letterSpacing: 'wide'
      },
      layout: {
        spacing: 'dramatic',
        borderRadius: '20px',
        shadows: 'retro-glow',
        animations: 'bouncy'
      },
      personality: 'Nostalgic, fun, synthwave aesthetic'
    });

    this.addTheme('minimalist-zen', {
      name: 'Minimalist Zen',
      category: 'creative',
      colors: {
        primary: '#2dd4bf',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#fefefe',
        text: '#374151',
        surface: '#f9fafb'
      },
      typography: {
        fontFamily: '"Lato", system-ui, sans-serif',
        headingScale: 1.2,
        lineHeight: 1.8,
        letterSpacing: 'relaxed'
      },
      layout: {
        spacing: 'spacious',
        borderRadius: '16px',
        shadows: 'minimal',
        animations: 'zen'
      },
      personality: 'Calm, clean, focused simplicity'
    });

    // Industry-Specific Themes
    this.addTheme('fintech-gold', {
      name: 'FinTech Gold',
      category: 'industry',
      colors: {
        primary: '#d4af37',
        secondary: '#2c3e50',
        accent: '#e74c3c',
        background: '#1a202c',
        text: '#ffffff',
        surface: '#2d3748'
      },
      typography: {
        fontFamily: '"Playfair Display", serif',
        headingScale: 1.4,
        lineHeight: 1.6,
        letterSpacing: 'tight'
      },
      layout: {
        spacing: 'premium',
        borderRadius: '8px',
        shadows: 'gold-accent',
        animations: 'elegant'
      },
      personality: 'Luxury, financial, premium services'
    });

    this.addTheme('healthcare-trust', {
      name: 'Healthcare Trust',
      category: 'industry',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#111827',
        surface: '#f0f9ff'
      },
      typography: {
        fontFamily: '"Source Sans Pro", system-ui, sans-serif',
        headingScale: 1.3,
        lineHeight: 1.7,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'comfortable',
        borderRadius: '12px',
        shadows: 'soft',
        animations: 'gentle'
      },
      personality: 'Trustworthy, medical, caring'
    });

    // Gaming & Entertainment Themes
    this.addTheme('gaming-esports', {
      name: 'Gaming eSports',
      category: 'entertainment',
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#ffe66d',
        background: '#1a1a2e',
        text: '#ffffff',
        surface: '#16213e'
      },
      typography: {
        fontFamily: '"Orbitron", gaming, sans-serif',
        headingScale: 1.6,
        lineHeight: 1.4,
        letterSpacing: 'wide'
      },
      layout: {
        spacing: 'energetic',
        borderRadius: '15px',
        shadows: 'rgb-glow',
        animations: 'gaming'
      },
      personality: 'High-energy, competitive, gaming culture'
    });

    // Add more themes...
    this.addMoreThemes();
  }

  addMoreThemes() {
    // Startup & Innovation Themes
    this.addTheme('startup-energy', {
      name: 'Startup Energy',
      category: 'startup',
      colors: {
        primary: '#8b5cf6',
        secondary: '#06b6d4',
        accent: '#f59e0b',
        background: '#fafafa',
        text: '#1f2937',
        surface: '#ffffff'
      },
      typography: {
        fontFamily: '"Nunito", system-ui, sans-serif',
        headingScale: 1.4,
        lineHeight: 1.6,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'dynamic',
        borderRadius: '16px',
        shadows: 'vibrant',
        animations: 'energetic'
      },
      personality: 'Innovative, fast-moving, disruptive'
    });

    this.addTheme('academic-research', {
      name: 'Academic Research',
      category: 'academic',
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        accent: '#dc2626',
        background: '#ffffff',
        text: '#1f2937',
        surface: '#f8fafc'
      },
      typography: {
        fontFamily: '"Crimson Text", serif',
        headingScale: 1.25,
        lineHeight: 1.8,
        letterSpacing: 'normal'
      },
      layout: {
        spacing: 'scholarly',
        borderRadius: '4px',
        shadows: 'paper',
        animations: 'subtle'
      },
      personality: 'Scholarly, research-focused, academic'
    });

    // Add 10 more unique themes
    const additionalThemes = [
      'holographic-future', 'vintage-sepia', 'neon-miami', 'arctic-minimal',
      'sunset-gradient', 'monochrome-bold', 'pastel-soft', 'industrial-steel',
      'nature-earth', 'space-cosmos', 'art-deco', 'brutalist-concrete'
    ];

    additionalThemes.forEach(themeId => {
      this.addTheme(themeId, this.generateThemeVariation(themeId));
    });
  }

  addTheme(id, config) {
    this.themes.set(id, {
      id,
      ...config,
      created: Date.now(),
      usageCount: 0,
      performanceScore: 0,
      css: this.generateCSS(config)
    });
  }

  generateThemeVariation(themeId) {
    // Generate unique theme configurations
    const variations = {
      'holographic-future': {
        name: 'Holographic Future',
        category: 'futuristic',
        colors: {
          primary: '#00d4ff',
          secondary: '#b794f6',
          accent: '#38d9a9',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          text: '#ffffff',
          surface: 'rgba(255,255,255,0.1)'
        },
        personality: 'Futuristic, holographic, sci-fi innovation'
      },
      'vintage-sepia': {
        name: 'Vintage Sepia',
        category: 'classic',
        colors: {
          primary: '#8b4513',
          secondary: '#a0522d',
          accent: '#daa520',
          background: '#fdf6e3',
          text: '#5d4037',
          surface: '#f5f5dc'
        },
        personality: 'Nostalgic, classic, timeless elegance'
      }
      // Add more variations as needed
    };

    return variations[themeId] || this.generateDefaultVariation(themeId);
  }

  generateDefaultVariation(themeId) {
    return {
      name: themeId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: 'custom',
      colors: this.generateRandomColorScheme(),
      personality: 'Unique, custom-generated theme'
    };
  }

  generateRandomColorScheme() {
    const hue = Math.floor(Math.random() * 360);
    return {
      primary: `hsl(${hue}, 70%, 50%)`,
      secondary: `hsl(${(hue + 120) % 360}, 60%, 40%)`,
      accent: `hsl(${(hue + 240) % 360}, 80%, 60%)`,
      background: '#ffffff',
      text: '#1a202c',
      surface: '#f7fafc'
    };
  }

  generateCSS(config) {
    return `
:root {
  --primary-color: ${config.colors.primary};
  --secondary-color: ${config.colors.secondary};
  --accent-color: ${config.colors.accent};
  --background-color: ${config.colors.background};
  --text-color: ${config.colors.text};
  --surface-color: ${config.colors.surface};
  
  --font-family: ${config.typography?.fontFamily || 'system-ui, sans-serif'};
  --heading-scale: ${config.typography?.headingScale || 1.25};
  --line-height: ${config.typography?.lineHeight || 1.6};
  --letter-spacing: ${config.typography?.letterSpacing || 'normal'};
  
  --border-radius: ${config.layout?.borderRadius || '8px'};
  --spacing: ${config.layout?.spacing || 'standard'};
}

body {
  background: var(--background-color);
  color: var(--text-color);
  font-family: var(--font-family);
  line-height: var(--line-height);
  letter-spacing: var(--letter-spacing);
}

.theme-${config.id || 'default'} {
  --active-theme: "${config.name || 'Default'}";
  transition: all 0.3s ease;
}

/* Theme-specific component styles */
.card { background: var(--surface-color); border-radius: var(--border-radius); }
.button-primary { background: var(--primary-color); color: white; }
.button-secondary { background: var(--secondary-color); color: white; }
.accent { color: var(--accent-color); }

/* Animation classes based on theme personality */
.animate-${config.id || 'default'} {
  animation: ${this.getAnimationForTheme(config)} 0.6s ease-out;
}

@keyframes theme-transition {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
  }

  getAnimationForTheme(config) {
    const animationMap = {
      'minimal': 'fadeIn',
      'dynamic': 'slideIn',
      'energetic': 'bounceIn',
      'elegant': 'fadeInUp',
      'gaming': 'pulseIn',
      'zen': 'floatIn'
    };
    
    return animationMap[config.layout?.animations] || 'theme-transition';
  }

  setupAdaptationRules() {
    // Define rules for automatic theme selection based on viewer behavior
    this.adaptationRules.set('technical_depth', {
      condition: (analytics) => analytics.codeViewTime > 30000, // 30 seconds viewing code
      themes: ['github-dev', 'terminal-matrix', 'cyberpunk-neon'],
      weight: 0.8
    });

    this.adaptationRules.set('corporate_preference', {
      condition: (analytics) => analytics.businessContentEngagement > 0.7,
      themes: ['corporate-clean', 'executive-dark', 'fintech-gold'],
      weight: 0.9
    });

    this.adaptationRules.set('creative_interest', {
      condition: (analytics) => analytics.designFocusTime > 20000,
      themes: ['retro-80s', 'minimalist-zen', 'art-deco'],
      weight: 0.7
    });

    this.adaptationRules.set('startup_energy', {
      condition: (analytics) => analytics.rapidScrolling && analytics.shortAttentionSpan,
      themes: ['startup-energy', 'gaming-esports', 'neon-miami'],
      weight: 0.6
    });

    this.adaptationRules.set('academic_focus', {
      condition: (analytics) => analytics.longReadTime > 60000, // 1 minute
      themes: ['academic-research', 'minimalist-zen', 'vintage-sepia'],
      weight: 0.8
    });
  }

  analyzeViewer(viewerId, behaviorData) {
    const analytics = {
      viewerId,
      timestamp: Date.now(),
      codeViewTime: behaviorData.codeViewTime || 0,
      businessContentEngagement: behaviorData.businessContentEngagement || 0,
      designFocusTime: behaviorData.designFocusTime || 0,
      rapidScrolling: behaviorData.rapidScrolling || false,
      shortAttentionSpan: behaviorData.averageTimePerSection < 10000,
      longReadTime: behaviorData.totalReadTime || 0,
      mousePatterns: behaviorData.mousePatterns || [],
      clickIntensity: behaviorData.clickIntensity || 0,
      preferredColors: behaviorData.preferredColors || [],
      deviceType: behaviorData.deviceType || 'desktop',
      timeOfDay: new Date().getHours(),
      previousVisits: behaviorData.previousVisits || 0
    };

    this.viewerAnalytics.set(viewerId, analytics);
    return this.selectOptimalTheme(analytics);
  }

  selectOptimalTheme(analytics) {
    const scores = new Map();
    
    // Calculate scores for each theme based on adaptation rules
    for (const [ruleId, rule] of this.adaptationRules.entries()) {
      if (rule.condition(analytics)) {
        rule.themes.forEach(themeId => {
          const currentScore = scores.get(themeId) || 0;
          scores.set(themeId, currentScore + rule.weight);
        });
      }
    }

    // Add base compatibility scores
    for (const [themeId, theme] of this.themes.entries()) {
      const compatibilityScore = this.calculateCompatibilityScore(theme, analytics);
      const currentScore = scores.get(themeId) || 0;
      scores.set(themeId, currentScore + compatibilityScore);
    }

    // Find the highest scoring theme
    let bestTheme = 'corporate-clean'; // default fallback
    let bestScore = 0;
    
    for (const [themeId, score] of scores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestTheme = themeId;
      }
    }

    // Track theme performance
    this.trackThemePerformance(bestTheme, analytics);
    
    return {
      themeId: bestTheme,
      theme: this.themes.get(bestTheme),
      confidence: Math.min(bestScore, 1.0),
      reasoning: this.generateThemeReasoning(bestTheme, analytics),
      alternatives: this.getAlternativeThemes(scores, 3)
    };
  }

  calculateCompatibilityScore(theme, analytics) {
    let score = 0;
    
    // Time of day preferences
    if (analytics.timeOfDay >= 9 && analytics.timeOfDay <= 17) {
      // Business hours - prefer professional themes
      if (theme.category === 'professional') score += 0.3;
    } else {
      // Off hours - more creative freedom
      if (theme.category === 'creative' || theme.category === 'tech') score += 0.2;
    }
    
    // Device type optimization
    if (analytics.deviceType === 'mobile' && theme.layout?.spacing === 'comfortable') {
      score += 0.2;
    }
    
    // Previous performance
    const themeMetrics = this.themePerformanceMetrics.get(theme.id);
    if (themeMetrics) {
      score += themeMetrics.averageEngagement * 0.1;
    }
    
    return score;
  }

  trackThemePerformance(themeId, analytics) {
    const theme = this.themes.get(themeId);
    if (theme) {
      theme.usageCount++;
      
      if (!this.themePerformanceMetrics.has(themeId)) {
        this.themePerformanceMetrics.set(themeId, {
          totalUsage: 0,
          averageEngagement: 0,
          successfulAdaptations: 0,
          feedbackScore: 0
        });
      }
      
      const metrics = this.themePerformanceMetrics.get(themeId);
      metrics.totalUsage++;
    }
  }

  generateThemeReasoning(themeId, analytics) {
    const theme = this.themes.get(themeId);
    const reasons = [];
    
    if (analytics.codeViewTime > 30000 && theme.category === 'tech') {
      reasons.push('Strong technical engagement detected');
    }
    
    if (analytics.businessContentEngagement > 0.7 && theme.category === 'professional') {
      reasons.push('Business-focused behavior patterns');
    }
    
    if (analytics.timeOfDay >= 9 && analytics.timeOfDay <= 17) {
      reasons.push('Professional hours optimization');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Default compatibility matching';
  }

  getAlternativeThemes(scores, count) {
    return Array.from(scores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(1, count + 1)
      .map(([themeId, score]) => ({
        themeId,
        theme: this.themes.get(themeId),
        score
      }));
  }

  // Real-time theme switching
  applyTheme(themeId, targetElement = document.body) {
    const theme = this.themes.get(themeId);
    if (!theme) return false;

    // Apply CSS custom properties
    const style = document.createElement('style');
    style.id = `theme-${themeId}`;
    style.textContent = theme.css;
    
    // Remove previous theme styles
    const existingThemes = document.querySelectorAll('[id^="theme-"]');
    existingThemes.forEach(el => el.remove());
    
    // Apply new theme
    document.head.appendChild(style);
    targetElement.className = targetElement.className.replace(/theme-\w+/g, '') + ` theme-${themeId}`;
    
    this.activeTheme = themeId;
    
    // Trigger theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { themeId, theme }
    }));
    
    return true;
  }

  // Analytics and reporting
  generateThemeAnalytics() {
    return {
      totalThemes: this.themes.size,
      activeTheme: this.activeTheme,
      viewerAnalytics: Array.from(this.viewerAnalytics.values()),
      themeUsageStats: Array.from(this.themes.values()).map(theme => ({
        id: theme.id,
        name: theme.name,
        category: theme.category,
        usageCount: theme.usageCount,
        performanceScore: theme.performanceScore
      })),
      adaptationRules: Array.from(this.adaptationRules.keys()),
      performanceMetrics: Object.fromEntries(this.themePerformanceMetrics)
    };
  }

  // Demo and testing methods
  simulateViewerBehavior(scenario = 'technical_viewer') {
    const scenarios = {
      technical_viewer: {
        codeViewTime: 45000,
        businessContentEngagement: 0.3,
        designFocusTime: 5000,
        rapidScrolling: false,
        averageTimePerSection: 25000,
        totalReadTime: 120000,
        deviceType: 'desktop'
      },
      business_executive: {
        codeViewTime: 5000,
        businessContentEngagement: 0.9,
        designFocusTime: 10000,
        rapidScrolling: false,
        averageTimePerSection: 15000,
        totalReadTime: 80000,
        deviceType: 'desktop'
      },
      startup_founder: {
        codeViewTime: 20000,
        businessContentEngagement: 0.7,
        designFocusTime: 15000,
        rapidScrolling: true,
        averageTimePerSection: 8000,
        totalReadTime: 45000,
        deviceType: 'mobile'
      }
    };

    const behaviorData = scenarios[scenario] || scenarios.technical_viewer;
    return this.analyzeViewer(`demo_${scenario}_${Date.now()}`, behaviorData);
  }

  // Export theme for external use
  exportTheme(themeId, format = 'css') {
    const theme = this.themes.get(themeId);
    if (!theme) return null;

    switch (format) {
      case 'css':
        return theme.css;
      case 'json':
        return JSON.stringify(theme, null, 2);
      case 'scss':
        return this.convertToSCSS(theme);
      default:
        return theme;
    }
  }

  convertToSCSS(theme) {
    // Convert theme to SCSS format
    return `
// ${theme.name} Theme
$primary: ${theme.colors.primary};
$secondary: ${theme.colors.secondary};
$accent: ${theme.colors.accent};
$background: ${theme.colors.background};
$text: ${theme.colors.text};
$surface: ${theme.colors.surface};

$font-family: ${theme.typography?.fontFamily || 'system-ui, sans-serif'};
$border-radius: ${theme.layout?.borderRadius || '8px'};

// Theme mixins
@mixin theme-${theme.id} {
  background: $background;
  color: $text;
  font-family: $font-family;
  
  .primary { color: $primary; }
  .secondary { color: $secondary; }
  .accent { color: $accent; }
}
`;
  }
}

// Export for use in other modules
module.exports = {
  AdaptiveThemingSystem
};