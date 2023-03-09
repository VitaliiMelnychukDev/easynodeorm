import { PostgresConnection } from './types/connection';
import BaseQueryManager from '../BaseQueryManager';

class PostgresQueryManager extends BaseQueryManager {
  protected readonly dbConnection: PostgresConnection;

  public constructor(dbConnection: any) {
    super({});
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string): Promise<T> {
    return Promise.resolve(queryString as T);
    //return this.dbConnection.query(queryString);
  }
}

export default PostgresQueryManager;
