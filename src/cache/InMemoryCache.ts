import NodeCache from 'node-cache';
import { ICache } from '../types/Cache';
class InMemoryCache implements ICache {
  private readonly cache: NodeCache;
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 0,
      errorOnMissing: false,
    });
  }
  set<T>(key: string, data: T): void {
    this.cache.set(key, data);
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

const inMemoryCache = new InMemoryCache();

export default inMemoryCache;
