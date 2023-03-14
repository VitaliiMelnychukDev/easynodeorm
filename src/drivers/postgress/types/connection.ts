import { QueryResult } from './query';

export type PostgresClient = BaseConnectionMethods & {
  release(): Promise<void>;
};
export type PostgresPoolConnection = BaseConnectionMethods & {
  connect(): Promise<PostgresClient>;
};

export type BaseConnectionMethods = {
  query<T>(query: string): Promise<QueryResult<T>>;
};

export default interface PostgresConnectionParams {
  host: string;
  user: string;
  database: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}
