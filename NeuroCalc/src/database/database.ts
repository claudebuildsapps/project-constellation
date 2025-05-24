import sqlite3 from 'sqlite3';
import { Substance, NeurotransmitterEffect, UserPreferences, LLMConfig } from '../renderer/types';

/**
 * SQLite database interface for NeuroCalc
 * Handles local storage of substances, calculations, and user preferences
 */
export class NeuroCalcDatabase {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = './neurocalc.db') {
    this.dbPath = dbPath;
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
          return;
        }
        
        this.createTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  /**
   * Create database tables if they don't exist
   */
  private async createTables(): Promise<void> {
    const tables = [
      // Substances table
      `CREATE TABLE IF NOT EXISTS substances (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        aliases TEXT, -- JSON array
        category TEXT NOT NULL,
        description TEXT,
        color TEXT,
        mechanisms TEXT, -- JSON array
        dosage_ranges TEXT, -- JSON array
        pharmacokinetics TEXT, -- JSON object
        warnings TEXT, -- JSON array
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Cached effects table
      `CREATE TABLE IF NOT EXISTS cached_effects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        substance_id TEXT NOT NULL,
        dosage REAL NOT NULL,
        route TEXT NOT NULL,
        unit TEXT NOT NULL,
        effects TEXT NOT NULL, -- JSON object
        confidence REAL NOT NULL,
        source TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(substance_id, dosage, route, unit),
        FOREIGN KEY (substance_id) REFERENCES substances (id)
      )`,

      // User preferences table
      `CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY,
        default_route TEXT DEFAULT 'oral',
        default_unit TEXT DEFAULT 'mg',
        auto_calculate BOOLEAN DEFAULT 1,
        show_warnings BOOLEAN DEFAULT 1,
        chart_type TEXT DEFAULT 'line',
        color_scheme TEXT DEFAULT 'light',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // LLM configuration table
      `CREATE TABLE IF NOT EXISTS llm_config (
        id INTEGER PRIMARY KEY,
        endpoint TEXT DEFAULT '',
        api_key TEXT DEFAULT '',
        model TEXT DEFAULT 'gpt-4',
        temperature REAL DEFAULT 0.3,
        max_tokens INTEGER DEFAULT 1000,
        enabled BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Calculation history table
      `CREATE TABLE IF NOT EXISTS calculation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        substance_id TEXT NOT NULL,
        dosage REAL NOT NULL,
        route TEXT NOT NULL,
        unit TEXT NOT NULL,
        effects TEXT NOT NULL, -- JSON object
        confidence REAL NOT NULL,
        source TEXT NOT NULL,
        safety_level TEXT,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (substance_id) REFERENCES substances (id)
      )`
    ];

    for (const tableSQL of tables) {
      await this.run(tableSQL);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_cached_effects_substance ON cached_effects(substance_id)',
      'CREATE INDEX IF NOT EXISTS idx_cached_effects_lookup ON cached_effects(substance_id, dosage, route, unit)',
      'CREATE INDEX IF NOT EXISTS idx_history_substance ON calculation_history(substance_id)',
      'CREATE INDEX IF NOT EXISTS idx_history_timestamp ON calculation_history(timestamp)'
    ];

    for (const indexSQL of indexes) {
      await this.run(indexSQL);
    }
  }

  /**
   * Insert or update substance in database
   */
  async upsertSubstance(substance: Substance): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO substances (
        id, name, aliases, category, description, color,
        mechanisms, dosage_ranges, pharmacokinetics, warnings, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const params = [
      substance.id,
      substance.name,
      JSON.stringify(substance.aliases),
      substance.category,
      substance.description,
      substance.color,
      JSON.stringify(substance.mechanisms),
      JSON.stringify(substance.dosageRanges),
      JSON.stringify(substance.pharmacokinetics),
      JSON.stringify(substance.warnings)
    ];

    await this.run(sql, params);
  }

  /**
   * Get all substances from database
   */
  async getSubstances(): Promise<Substance[]> {
    const sql = 'SELECT * FROM substances ORDER BY name';
    const rows = await this.all(sql);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      aliases: JSON.parse(row.aliases || '[]'),
      category: row.category,
      description: row.description,
      color: row.color,
      mechanisms: JSON.parse(row.mechanisms || '[]'),
      dosageRanges: JSON.parse(row.dosage_ranges || '[]'),
      pharmacokinetics: JSON.parse(row.pharmacokinetics || '{}'),
      warnings: JSON.parse(row.warnings || '[]')
    }));
  }

  /**
   * Get substance by ID
   */
  async getSubstance(id: string): Promise<Substance | null> {
    const sql = 'SELECT * FROM substances WHERE id = ?';
    const row = await this.get(sql, [id]);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      aliases: JSON.parse(row.aliases || '[]'),
      category: row.category,
      description: row.description,
      color: row.color,
      mechanisms: JSON.parse(row.mechanisms || '[]'),
      dosageRanges: JSON.parse(row.dosage_ranges || '[]'),
      pharmacokinetics: JSON.parse(row.pharmacokinetics || '{}'),
      warnings: JSON.parse(row.warnings || '[]')
    };
  }

  /**
   * Cache calculation effect
   */
  async cacheEffect(effect: NeurotransmitterEffect): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO cached_effects (
        substance_id, dosage, route, unit, effects, confidence, source, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      effect.substance,
      effect.dosage,
      effect.route,
      'mg', // Default unit for now
      JSON.stringify(effect.effects),
      effect.confidence,
      effect.source,
      effect.timestamp
    ];

    await this.run(sql, params);
  }

  /**
   * Get cached effect
   */
  async getCachedEffect(
    substanceId: string,
    dosage: number,
    route: string,
    unit: string = 'mg',
    tolerance: number = 0.1
  ): Promise<NeurotransmitterEffect | null> {
    // Look for exact match first
    let sql = `
      SELECT * FROM cached_effects 
      WHERE substance_id = ? AND dosage = ? AND route = ? AND unit = ?
      ORDER BY timestamp DESC LIMIT 1
    `;
    
    let row = await this.get(sql, [substanceId, dosage, route, unit]);

    // If no exact match, look for close matches within tolerance
    if (!row && tolerance > 0) {
      const minDose = dosage * (1 - tolerance);
      const maxDose = dosage * (1 + tolerance);
      
      sql = `
        SELECT * FROM cached_effects 
        WHERE substance_id = ? AND dosage BETWEEN ? AND ? AND route = ? AND unit = ?
        ORDER BY ABS(dosage - ?) ASC, timestamp DESC LIMIT 1
      `;
      
      row = await this.get(sql, [substanceId, minDose, maxDose, route, unit, dosage]);
    }

    if (!row) return null;

    return {
      substance: row.substance_id,
      dosage: row.dosage,
      route: row.route,
      timestamp: row.timestamp,
      effects: JSON.parse(row.effects),
      confidence: row.confidence,
      source: row.source
    };
  }

  /**
   * Save calculation to history
   */
  async saveToHistory(effect: NeurotransmitterEffect, safetyLevel?: string): Promise<void> {
    const sql = `
      INSERT INTO calculation_history (
        substance_id, dosage, route, unit, effects, confidence, source, safety_level, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      effect.substance,
      effect.dosage,
      effect.route,
      'mg', // Default unit
      JSON.stringify(effect.effects),
      effect.confidence,
      effect.source,
      safetyLevel || null,
      effect.timestamp
    ];

    await this.run(sql, params);
  }

  /**
   * Get calculation history
   */
  async getHistory(limit: number = 50, offset: number = 0): Promise<any[]> {
    const sql = `
      SELECT h.*, s.name as substance_name 
      FROM calculation_history h
      JOIN substances s ON h.substance_id = s.id
      ORDER BY h.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    return await this.all(sql, [limit, offset]);
  }

  /**
   * Get or create user preferences
   */
  async getUserPreferences(): Promise<UserPreferences> {
    const sql = 'SELECT * FROM user_preferences WHERE id = 1';
    const row = await this.get(sql);

    if (row) {
      return {
        defaultRoute: row.default_route,
        defaultUnit: row.default_unit,
        autoCalculate: Boolean(row.auto_calculate),
        showWarnings: Boolean(row.show_warnings),
        chartType: row.chart_type,
        colorScheme: row.color_scheme
      };
    }

    // Create default preferences
    const defaultPrefs: UserPreferences = {
      defaultRoute: 'oral',
      defaultUnit: 'mg',
      autoCalculate: true,
      showWarnings: true,
      chartType: 'line',
      colorScheme: 'light'
    };

    await this.setUserPreferences(defaultPrefs);
    return defaultPrefs;
  }

  /**
   * Update user preferences
   */
  async setUserPreferences(prefs: UserPreferences): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO user_preferences (
        id, default_route, default_unit, auto_calculate, show_warnings, chart_type, color_scheme, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const params = [
      prefs.defaultRoute,
      prefs.defaultUnit,
      prefs.autoCalculate ? 1 : 0,
      prefs.showWarnings ? 1 : 0,
      prefs.chartType,
      prefs.colorScheme
    ];

    await this.run(sql, params);
  }

  /**
   * Get LLM configuration
   */
  async getLLMConfig(): Promise<LLMConfig> {
    const sql = 'SELECT * FROM llm_config WHERE id = 1';
    const row = await this.get(sql);

    if (row) {
      return {
        endpoint: row.endpoint,
        apiKey: row.api_key,
        model: row.model,
        temperature: row.temperature,
        maxTokens: row.max_tokens,
        enabled: Boolean(row.enabled)
      };
    }

    // Return default config
    return {
      endpoint: '',
      apiKey: '',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
      enabled: false
    };
  }

  /**
   * Update LLM configuration
   */
  async setLLMConfig(config: LLMConfig): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO llm_config (
        id, endpoint, api_key, model, temperature, max_tokens, enabled, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const params = [
      config.endpoint,
      config.apiKey,
      config.model,
      config.temperature,
      config.maxTokens,
      config.enabled ? 1 : 0
    ];

    await this.run(sql, params);
  }

  /**
   * Clean old cached effects (keep only recent ones)
   */
  async cleanOldCache(daysToKeep: number = 30): Promise<void> {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const sql = 'DELETE FROM cached_effects WHERE timestamp < ?';
    await this.run(sql, [cutoffTime]);
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    const queries = [
      { name: 'substances', sql: 'SELECT COUNT(*) as count FROM substances' },
      { name: 'cached_effects', sql: 'SELECT COUNT(*) as count FROM cached_effects' },
      { name: 'calculation_history', sql: 'SELECT COUNT(*) as count FROM calculation_history' }
    ];

    const stats: any = {};
    for (const query of queries) {
      const row = await this.get(query.sql);
      stats[query.name] = row.count;
    }

    return stats;
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Helper methods for database operations
  private async run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  private async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  private async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

// Singleton instance for the main application
export const database = new NeuroCalcDatabase();