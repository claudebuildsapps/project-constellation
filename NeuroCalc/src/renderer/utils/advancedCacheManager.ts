/**
 * Advanced Cache Manager
 * Intelligent multi-level caching with persistence, compression, and smart eviction
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  priority: number;
  compressed?: boolean;
}

interface CacheOptions {
  maxSize: number;
  maxAge: number;
  maxEntries: number;
  persistToDisk: boolean;
  compressionThreshold: number;
  evictionStrategy: 'LRU' | 'LFU' | 'HYBRID';
}

interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheSize: number;
  memoryUsage: number;
  compressionRatio: number;
}

export class AdvancedCacheManager<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private persistentCache = new Map<string, string>(); // For localStorage
  private stats = {
    hits: 0,
    misses: 0,
    totalSize: 0
  };
  
  private readonly options: CacheOptions;
  private readonly storageKey: string;
  
  constructor(namespace: string, options: Partial<CacheOptions> = {}) {
    this.storageKey = `neurocalc_cache_${namespace}`;
    this.options = {
      maxSize: 50 * 1024 * 1024, // 50MB
      maxAge: 30 * 60 * 1000, // 30 minutes
      maxEntries: 10000,
      persistToDisk: true,
      compressionThreshold: 1024, // 1KB
      evictionStrategy: 'HYBRID',
      ...options
    };
    
    this.loadFromPersistentStorage();
    this.startCleanupInterval();
  }
  
  /**
   * Intelligent cache retrieval with access tracking
   */
  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      
      // Try persistent cache
      const persistent = this.getPersistent(key);
      if (persistent) {
        return persistent;
      }
      
      return null;
    }
    
    // Check expiration
    if (Date.now() - entry.timestamp > this.options.maxAge) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    this.stats.hits++;
    
    // Decompress if needed
    if (entry.compressed && typeof entry.data === 'string') {
      try {
        return JSON.parse(entry.data as string) as T;
      } catch {
        return entry.data;
      }
    }
    
    return entry.data;
  }
  
  /**
   * Intelligent cache storage with compression and prioritization
   */
  public set(key: string, data: T, priority: number = 1): void {
    const now = Date.now();
    const serialized = JSON.stringify(data);
    const size = this.getDataSize(serialized);
    
    // Compress large data
    let finalData: T | string = data;
    let compressed = false;
    
    if (size > this.options.compressionThreshold) {
      try {
        finalData = this.compress(serialized);
        compressed = true;
      } catch {
        finalData = data;
      }
    }
    
    const entry: CacheEntry<T> = {
      data: finalData,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      size,
      priority,
      compressed
    };
    
    // Check if we need to evict entries
    if (this.shouldEvict(size)) {
      this.evictEntries(size);
    }
    
    this.cache.set(key, entry);
    this.stats.totalSize += size;
    
    // Persist important entries
    if (this.options.persistToDisk && priority > 5) {
      this.setPersistent(key, serialized);
    }
  }
  
  /**
   * Batch cache operations for efficiency
   */
  public setBatch(entries: Array<{ key: string; data: T; priority?: number }>): void {
    const sortedEntries = entries.sort((a, b) => (b.priority || 1) - (a.priority || 1));
    
    for (const entry of sortedEntries) {
      this.set(entry.key, entry.data, entry.priority || 1);
    }
  }
  
  /**
   * Intelligent cache warming for predictive loading
   */
  public async warmCache(
    keysToWarm: string[],
    dataGenerator: (key: string) => Promise<T>,
    priority: number = 3
  ): Promise<void> {
    const promises = keysToWarm.map(async (key) => {
      if (!this.has(key)) {
        try {
          const data = await dataGenerator(key);
          this.set(key, data, priority);
        } catch (error) {
          console.warn(`Failed to warm cache for key: ${key}`, error);
        }
      }
    });
    
    await Promise.allSettled(promises);
  }
  
  /**
   * Smart eviction based on strategy
   */
  private evictEntries(newEntrySize: number): void {
    const target = this.options.maxSize * 0.7; // Evict to 70% capacity
    const currentSize = this.stats.totalSize;
    const sizeToFree = currentSize + newEntrySize - target;
    
    if (sizeToFree <= 0) return;
    
    const entries = Array.from(this.cache.entries());
    let candidates: Array<[string, CacheEntry<T>]> = [];
    
    switch (this.options.evictionStrategy) {
      case 'LRU':
        candidates = entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        break;
        
      case 'LFU':
        candidates = entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
        break;
        
      case 'HYBRID':
        // Hybrid strategy considering age, frequency, and priority
        candidates = entries.sort((a, b) => {
          const scoreA = this.calculateEvictionScore(a[1]);
          const scoreB = this.calculateEvictionScore(b[1]);
          return scoreA - scoreB;
        });
        break;
    }
    
    let freedSize = 0;
    for (const [key, entry] of candidates) {
      if (freedSize >= sizeToFree) break;
      
      this.cache.delete(key);
      freedSize += entry.size;
      this.stats.totalSize -= entry.size;
    }
  }
  
  /**
   * Calculate eviction score for hybrid strategy
   */
  private calculateEvictionScore(entry: CacheEntry<T>): number {
    const now = Date.now();
    const age = now - entry.timestamp;
    const timeSinceAccess = now - entry.lastAccessed;
    
    // Lower score = higher eviction priority
    const ageScore = age / this.options.maxAge;
    const accessScore = 1 / (entry.accessCount + 1);
    const recencyScore = timeSinceAccess / this.options.maxAge;
    const priorityScore = 1 / entry.priority;
    
    return (ageScore * 0.3 + accessScore * 0.3 + recencyScore * 0.3 + priorityScore * 0.1);
  }
  
  /**
   * Check if eviction is needed
   */
  private shouldEvict(newEntrySize: number): boolean {
    return (
      this.stats.totalSize + newEntrySize > this.options.maxSize ||
      this.cache.size >= this.options.maxEntries
    );
  }
  
  /**
   * Simple compression for large data
   */
  private compress(data: string): string {
    // Simple compression using repetition patterns
    // In production, you might use a proper compression library
    return data.replace(/(.{10,}?)\1+/g, (match, p1) => {
      const count = match.length / p1.length;
      return `__REPEAT__${count}__${p1}__END__`;
    });
  }
  
  /**
   * Decompress data
   */
  private decompress(data: string): string {
    return data.replace(/__REPEAT__(\d+)__(.*?)__END__/g, (match, count, pattern) => {
      return pattern.repeat(parseInt(count));
    });
  }
  
  /**
   * Get data size estimation
   */
  private getDataSize(data: string): number {
    return new Blob([data]).size;
  }
  
  /**
   * Persistent storage operations
   */
  private loadFromPersistentStorage(): void {
    if (!this.options.persistToDisk || typeof localStorage === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.persistentCache = new Map(parsed);
        
        // Load high-priority items back to memory
        for (const [key, value] of this.persistentCache.entries()) {
          try {
            const data = JSON.parse(value);
            if (data.priority > 7) { // High priority threshold
              this.set(key, data.data, data.priority);
            }
          } catch (error) {
            // Remove corrupted entries
            this.persistentCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load persistent cache:', error);
    }
  }
  
  private setPersistent(key: string, data: string): void {
    if (!this.options.persistToDisk || typeof localStorage === 'undefined') return;
    
    try {
      this.persistentCache.set(key, data);
      
      // Limit persistent cache size
      if (this.persistentCache.size > 1000) {
        const entries = Array.from(this.persistentCache.entries());
        const toDelete = entries.slice(0, 200); // Remove oldest 200 entries
        toDelete.forEach(([k]) => this.persistentCache.delete(k));
      }
      
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(Array.from(this.persistentCache.entries()))
      );
    } catch (error) {
      console.warn('Failed to persist cache entry:', error);
    }
  }
  
  private getPersistent(key: string): T | null {
    if (!this.options.persistToDisk) return null;
    
    const stored = this.persistentCache.get(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Move back to memory cache
        this.set(key, data, 1);
        return data;
      } catch {
        this.persistentCache.delete(key);
      }
    }
    
    return null;
  }
  
  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expired: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.options.maxAge) {
        expired.push(key);
        this.stats.totalSize -= entry.size;
      }
    }
    
    expired.forEach(key => this.cache.delete(key));
  }
  
  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }
  
  /**
   * Public utility methods
   */
  public has(key: string): boolean {
    return this.cache.has(key) || this.persistentCache.has(key);
  }
  
  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.totalSize -= entry.size;
    }
    
    this.persistentCache.delete(key);
    return this.cache.delete(key);
  }
  
  public clear(): void {
    this.cache.clear();
    this.persistentCache.clear();
    this.stats = { hits: 0, misses: 0, totalSize: 0 };
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
  
  public getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    
    return {
      hitRate: total > 0 ? this.stats.hits / total : 0,
      missRate: total > 0 ? this.stats.misses / total : 0,
      totalRequests: total,
      cacheSize: this.cache.size,
      memoryUsage: this.stats.totalSize,
      compressionRatio: this.calculateCompressionRatio()
    };
  }
  
  private calculateCompressionRatio(): number {
    let originalSize = 0;
    let compressedSize = 0;
    
    for (const entry of this.cache.values()) {
      if (entry.compressed) {
        compressedSize += entry.size;
        originalSize += entry.size * 1.5; // Estimate
      } else {
        originalSize += entry.size;
        compressedSize += entry.size;
      }
    }
    
    return originalSize > 0 ? compressedSize / originalSize : 1;
  }
}

// Global cache instances for different data types
export const comparisonCache = new AdvancedCacheManager<any>('comparisons', {
  maxSize: 30 * 1024 * 1024, // 30MB
  maxAge: 20 * 60 * 1000, // 20 minutes
  persistToDisk: true,
  compressionThreshold: 2048
});

export const substanceCache = new AdvancedCacheManager<any>('substances', {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxAge: 60 * 60 * 1000, // 1 hour
  persistToDisk: true,
  evictionStrategy: 'LFU'
});

export const calculationCache = new AdvancedCacheManager<any>('calculations', {
  maxSize: 20 * 1024 * 1024, // 20MB
  maxAge: 15 * 60 * 1000, // 15 minutes
  persistToDisk: false, // Fast access needed
  evictionStrategy: 'HYBRID'
});