import { BaseConnectionMethods } from './types/connection';
import DataManipulationQueryManager from '../DataManipulationQueryManager';
import PostgresInsertBuilder from './query-builders/PostgresInsertBuilder';
import { QueryResult } from './types/query';
import PostgresDeleteBuilder from './query-builders/PostgresDeleteBuilder';
import BaseSelectBuilder from '../query-builders/BaseSelectBuilder';
import PostgresUpdateBuilder from './query-builders/PostgresUpdateBuilder';

class PostgresQueryManager extends DataManipulationQueryManager {
  protected readonly dbConnection: BaseConnectionMethods;

  public constructor(dbConnection: BaseConnectionMethods) {
    const selectBuilder = new BaseSelectBuilder();

    super({
      selectBuilder,
      insertBuilder: new PostgresInsertBuilder(),
      deleteBuilder: new PostgresDeleteBuilder(selectBuilder),
      updateBuilder: new PostgresUpdateBuilder(selectBuilder),
    });
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string): Promise<T[]> {
    const result: QueryResult<T> = await this.dbConnection.query(queryString);

    return result.rows;
  }
}

export default PostgresQueryManager;
