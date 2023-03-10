import { QueryResult } from './query';

export interface PostgresConnection {
  query<T>(query: string): QueryResult<T>;
}
export default interface PostgresConnectionParams {
  host: string;
  user: string;
  database: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}
