import { PostgresConnection } from './types/connection';
import BaseQueryManager from '../BaseQueryManager';
import PostgresInsertBuilder from './query-builders/PostgresInsertBuilder';
import { QueryResult } from './types/query';

class PostgresQueryManager extends BaseQueryManager {
  protected readonly dbConnection: PostgresConnection;

  public constructor(dbConnection: any) {
    super({
      insertBuilder: new PostgresInsertBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string): Promise<T[]> {
    const result: QueryResult<T> = await this.dbConnection.query(queryString);

    return result.rows;
  }
}

export default PostgresQueryManager;
