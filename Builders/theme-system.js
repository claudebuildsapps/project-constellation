/**
 * Revolutionary 15-Theme System
 * Demonstrates creative and technical versatility through massive visual variation
 * Each theme targets different psychological and professional preferences
 */

class ThemeSystem {
    constructor() {
        this.themes = {
            // CORPORATE & PROFESSIONAL
            'corporate-minimal': {
                name: 'Corporate Minimal',
                target: 'Technical Managers, Enterprise Clients',
                colors: {
                    primary: '#2563eb',
                    secondary: '#64748b',
                    accent: '#3b82f6',
                    background: '#f8fafc',
                    surface: '#ffffff',
                    text: '#334155'
                },
                fonts: {
                    heading: 'Inter, -apple-system, sans-serif',
                    body: 'Inter, -apple-system, sans-serif',
                    mono: 'JetBrains Mono, monospace'
                },
                style: 'clean, professional, trust-building',
                mood: 'confident, reliable, enterprise-ready'
            },

            'dark-executive': {
                name: 'Dark Executive',
                target: 'Senior Leadership, CTOs, VPs',
                colors: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6',
                    accent: '#a855f7',
                    background: '#0f0f23',
                    surface: '#1e1b3a',
                    text: '#e2e8f0'
                },
                fonts: {
                    heading: 'Playfair Display, serif',
                    body: 'Source Sans Pro, sans-serif',
                    mono: 'Source Code Pro, monospace'
                },
                style: 'sophisticated, powerful, premium',
                mood: 'authoritative, exclusive, high-end'
            },

            // TECH & INNOVATION
            'cyberpunk-hacker': {
                name: 'Cyberpunk Hacker',
                target: 'Senior Engineers, Tech Innovators',
                colors: {
                    primary: '#00ff41',
                    secondary: '#ff0080',
                    accent: '#00ffff',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    text: '#00ff41'
                },
                fonts: {
                    heading: 'Orbitron, monospace',
                    body: 'Share Tech Mono, monospace',
                    mono: 'Fira Code, monospace'
                },
                style: 'futuristic, edgy, high-tech',
                mood: 'rebellious, innovative, cutting-edge'
            },

            'neon-synthwave': {
                name: 'Neon Synthwave',
                target: 'Creative Developers, Game Industry',
                colors: {
                    primary: '#ff0080',
                    secondary: '#00ffff',
                    accent: '#ffff00',
                    background: '#0d1b2a',
                    surface: '#1b263b',
                    text: '#e0e1dd'
                },
                fonts: {
                    heading: 'Audiowide, cursive',
                    body: 'Rajdhani, sans-serif',
                    mono: 'VT323, monospace'
                },
                style: 'retro-futuristic, vibrant, nostalgic',
                mood: 'energetic, creative, 80s-inspired'
            },

            'holographic-future': {
                name: 'Holographic Future',
                target: 'AI/ML Engineers, Research Scientists',
                colors: {
                    primary: '#00d4ff',
                    secondary: '#7c3aed',
                    accent: '#06ffa5',
                    background: '#050816',
                    surface: '#0f172a',
                    text: '#f1f5f9'
                },
                fonts: {
                    heading: 'Exo 2, sans-serif',
                    body: 'Nunito Sans, sans-serif',
                    mono: 'JetBrains Mono, monospace'
                },
                style: 'sci-fi, translucent, holographic',
                mood: 'innovative, futuristic, intelligent'
            },

            // CREATIVE & ARTISTIC
            'artistic-gradient': {
                name: 'Artistic Gradient',
                target: 'Design Teams, Creative Directors',
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#f093fb',
                    background: '#ffecd2',
                    surface: '#ffffff',
                    text: '#4a5568'
                },
                fonts: {
                    heading: 'Poppins, sans-serif',
                    body: 'Open Sans, sans-serif',
                    mono: 'Roboto Mono, monospace'
                },
                style: 'colorful, creative, inspiring',
                mood: 'artistic, innovative, expressive'
            },

            'nature-organic': {
                name: 'Nature Organic',
                target: 'Sustainable Tech, Green Companies',
                colors: {
                    primary: '#16a085',
                    secondary: '#27ae60',
                    accent: '#f39c12',
                    background: '#ecf0f1',
                    surface: '#ffffff',
                    text: '#2c3e50'
                },
                fonts: {
                    heading: 'Merriweather, serif',
                    body: 'Lato, sans-serif',
                    mono: 'Ubuntu Mono, monospace'
                },
                style: 'natural, calming, sustainable',
                mood: 'peaceful, growth-oriented, responsible'
            },

            // RETRO & VINTAGE
            'retro-gaming': {
                name: 'Retro Gaming',
                target: 'Gaming Industry, Entertainment Tech',
                colors: {
                    primary: '#ff6b6b',
                    secondary: '#4ecdc4',
                    accent: '#ffe66d',
                    background: '#2d3436',
                    surface: '#636e72',
                    text: '#ddd'
                },
                fonts: {
                    heading: 'Press Start 2P, cursive',
                    body: 'Pixelify Sans, cursive',
                    mono: 'Courier New, monospace'
                },
                style: 'pixelated, nostalgic, playful',
                mood: 'fun, nostalgic, creative'
            },

            'vintage-terminal': {
                name: 'Vintage Terminal',
                target: 'DevOps, System Administrators',
                colors: {
                    primary: '#00ff00',
                    secondary: '#ffff00',
                    accent: '#ff8c00',
                    background: '#000000',
                    surface: '#1a1a1a',
                    text: '#00ff00'
                },
                fonts: {
                    heading: 'Courier New, monospace',
                    body: 'Courier New, monospace',
                    mono: 'Courier New, monospace'
                },
                style: 'terminal, retro, authentic',
                mood: 'nostalgic, technical, authentic'
            },

            // MODERN & TRENDY
            'glassmorphism': {
                name: 'Glassmorphism',
                target: 'Modern Startups, UI/UX Teams',
                colors: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6',
                    accent: '#ec4899',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    surface: 'rgba(255, 255, 255, 0.25)',
                    text: '#ffffff'
                },
                fonts: {
                    heading: 'Inter, sans-serif',
                    body: 'Inter, sans-serif',
                    mono: 'JetBrains Mono, monospace'
                },
                style: 'transparent, modern, elegant',
                mood: 'trendy, sophisticated, premium'
            },

            'neomorphism': {
                name: 'Neomorphism',
                target: 'Product Designers, Modern Agencies',
                colors: {
                    primary: '#6c5ce7',
                    secondary: '#a29bfe',
                    accent: '#fd79a8',
                    background: '#ddd6fe',
                    surface: '#e5e7eb',
                    text: '#374151'
                },
                fonts: {
                    heading: 'SF Pro Display, sans-serif',
                    body: 'SF Pro Text, sans-serif',
                    mono: 'SF Mono, monospace'
                },
                style: 'soft, tactile, modern',
                mood: 'calm, sophisticated, user-friendly'
            },

            // SPECIALIZED INDUSTRIES
            'medical-precision': {
                name: 'Medical Precision',
                target: 'Healthcare Tech, Medical Software',
                colors: {
                    primary: '#0ea5e9',
                    secondary: '#06b6d4',
                    accent: '#10b981',
                    background: '#f8fafc',
                    surface: '#ffffff',
                    text: '#1e293b'
                },
                fonts: {
                    heading: 'Roboto, sans-serif',
                    body: 'Roboto, sans-serif',
                    mono: 'Roboto Mono, monospace'
                },
                style: 'clean, precise, trustworthy',
                mood: 'professional, reliable, caring'
            },

            'fintech-gold': {
                name: 'FinTech Gold',
                target: 'Financial Services, Banking Tech',
                colors: {
                    primary: '#d4af37',
                    secondary: '#1f2937',
                    accent: '#059669',
                    background: '#f9fafb',
                    surface: '#ffffff',
                    text: '#111827'
                },
                fonts: {
                    heading: 'Montserrat, sans-serif',
                    body: 'Source Sans Pro, sans-serif',
                    mono: 'Source Code Pro, monospace'
                },
                style: 'luxurious, stable, premium',
                mood: 'trustworthy, premium, sophisticated'
            },

            // ACADEMIC & RESEARCH
            'academic-research': {
                name: 'Academic Research',
                target: 'Universities, Research Institutions',
                colors: {
                    primary: '#1e40af',
                    secondary: '#7c2d12',
                    accent: '#059669',
                    background: '#f9fafb',
                    surface: '#ffffff',
                    text: '#374151'
                },
                fonts: {
                    heading: 'Crimson Text, serif',
                    body: 'Source Sans Pro, sans-serif',
                    mono: 'Source Code Pro, monospace'
                },
                style: 'scholarly, professional, authoritative',
                mood: 'intellectual, trustworthy, academic'
            },

            // STARTUP & INNOVATION
            'startup-energy': {
                name: 'Startup Energy',
                target: 'Startups, Innovation Labs',
                colors: {
                    primary: '#f59e0b',
                    secondary: '#ef4444',
                    accent: '#8b5cf6',
                    background: '#fef3c7',
                    surface: '#ffffff',
                    text: '#92400e'
                },
                fonts: {
                    heading: 'Work Sans, sans-serif',
                    body: 'Work Sans, sans-serif',
                    mono: 'Fira Code, monospace'
                },
                style: 'energetic, bold, dynamic',
                mood: 'optimistic, fast-paced, innovative'
            }
        };

        this.currentTheme = 'cyberpunk-hacker';
    }

    applyTheme(themeName, targetElement = document.documentElement) {
        if (!this.themes[themeName]) {
            console.error(`Theme "${themeName}" not found`);
            return false;
        }

        const theme = this.themes[themeName];
        this.currentTheme = themeName;

        // Apply CSS custom properties
        const root = targetElement;
        
        // Colors
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--color-surface', theme.colors.surface);
        root.style.setProperty('--color-text', theme.colors.text);

        // Fonts
        root.style.setProperty('--font-heading', theme.fonts.heading);
        root.style.setProperty('--font-body', theme.fonts.body);
        root.style.setProperty('--font-mono', theme.fonts.mono);

        // Add theme class to body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        console.log(`✨ Applied theme: ${theme.name} (targeting ${theme.target})`);
        return true;
    }

    getThemeCSS(themeName) {
        if (!this.themes[themeName]) return '';

        const theme = this.themes[themeName];
        
        return `
/* ${theme.name} Theme - ${theme.target} */
.theme-${themeName} {
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text: ${theme.colors.text};
    
    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};
    --font-mono: ${theme.fonts.mono};
    
    /* Theme-specific styles */
    background: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-body);
}

.theme-${themeName} h1, .theme-${themeName} h2, .theme-${themeName} h3,
.theme-${themeName} h4, .theme-${themeName} h5, .theme-${themeName} h6 {
    font-family: var(--font-heading);
    color: var(--color-primary);
}

.theme-${themeName} code, .theme-${themeName} pre {
    font-family: var(--font-mono);
}

/* ${theme.style} | ${theme.mood} */
`;
    }

    getAllThemesCSS() {
        return Object.keys(this.themes).map(themeName => 
            this.getThemeCSS(themeName)
        ).join('\n\n');
    }

    createThemeSelector() {
        const selector = document.createElement('div');
        selector.innerHTML = `
            <div style="position: fixed; top: 20px; left: 20px; z-index: 1000; background: rgba(0,0,0,0.8); padding: 1rem; border-radius: 8px; backdrop-filter: blur(10px);">
                <label style="color: white; font-weight: bold; margin-bottom: 0.5rem; display: block;">Choose Theme:</label>
                <select id="themeSelector" style="padding: 0.5rem; border-radius: 4px; border: none; background: #333; color: white; width: 200px;">
                    ${Object.entries(this.themes).map(([key, theme]) => 
                        `<option value="${key}" ${key === this.currentTheme ? 'selected' : ''}>${theme.name}</option>`
                    ).join('')}
                </select>
            </div>
        `;

        document.body.appendChild(selector);

        document.getElementById('themeSelector').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        return selector;
    }

    getThemeList() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            id: key,
            name: theme.name,
            target: theme.target,
            style: theme.style,
            mood: theme.mood
        }));
    }

    exportThemes() {
        const data = {
            timestamp: new Date().toISOString(),
            totalThemes: Object.keys(this.themes).length,
            currentTheme: this.currentTheme,
            themes: this.themes,
            css: this.getAllThemesCSS()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `15-theme-system-${Date.now()}.json`;
        a.click();
    }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.ThemeSystem = ThemeSystem;
    window.themeSystem = new ThemeSystem();
    
    // Auto-create theme selector
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('themeSelector')) {
            window.themeSystem.createThemeSelector();
        }
    });
}

module.exports = ThemeSystem;