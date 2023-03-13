import { PostgresConnection } from './types/connection';
import DataManipulationQueryManager from '../DataManipulationQueryManager';
import PostgresInsertBuilder from './query-builders/PostgresInsertBuilder';
import { QueryResult } from './types/query';
import PostgresDeleteBuilder from './query-builders/PostgresDeleteBuilder';
import BaseSelectBuilder from '../base-query-builders/BaseSelectBuilder';

class PostgresQueryManager extends DataManipulationQueryManager {
  protected readonly dbConnection: PostgresConnection;

  public constructor(dbConnection: any) {
    const selectBuilder = new BaseSelectBuilder();

    super({
      selectBuilder,
      insertBuilder: new PostgresInsertBuilder(),
      deleteBuilder: new PostgresDeleteBuilder(selectBuilder),
    });
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string): Promise<T[]> {
    const result: QueryResult<T> = await this.dbConnection.query(queryString);

    return result.rows;
  }
}

export default PostgresQueryManager;
