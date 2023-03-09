import { PostgresConnection } from './types/connection';
import BaseQueryManager from '../BaseQueryManager';
import PostgresInsertBuilder from './query-builders/PostgresInsertBuilder';

class PostgresQueryManager extends BaseQueryManager {
  protected readonly dbConnection: PostgresConnection;

  public constructor(dbConnection: any) {
    super({
      insertBuilder: new PostgresInsertBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string): Promise<T> {
    return this.dbConnection.query(queryString);
  }
}

export default PostgresQueryManager;
