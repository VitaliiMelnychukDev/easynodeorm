export type MySqlClient = BaseConnectionMethods & {
  release(): Promise<void>;
};
export type MySqlPoolConnection = BaseConnectionMethods & {
  getConnection(): Promise<MySqlClient>;
};

export type BaseConnectionMethods = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  query<T>(query: string): Promise<any>;
};

export default interface MySqlConnectionParams {
  host: string;
  user: string;
  database: string;
  password: string;
  connectionLimit: number;

  multipleStatements: boolean;
}
