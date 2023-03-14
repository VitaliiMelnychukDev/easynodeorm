import SQLBaseEntity from './SQLBaseEntity';

abstract class BaseSeparateConnectionManager<
  AllowedTypes,
> extends SQLBaseEntity<AllowedTypes> {
  abstract startTransaction(isolationLevel?: unknown): Promise<unknown>;
  abstract commitTransaction(): Promise<unknown>;
  abstract rollbackTransaction(): Promise<unknown>;
  abstract releaseConnection(): Promise<unknown>;
}

export default BaseSeparateConnectionManager;
