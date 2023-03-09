export interface ICache {
  set<T>(key: string, data: T): void;
  get<T>(key: string): T | undefined;
  has(key: string): boolean;
}
