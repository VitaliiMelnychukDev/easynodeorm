export interface PostgresConnection {
  query(query: string): Promise<any>;
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
