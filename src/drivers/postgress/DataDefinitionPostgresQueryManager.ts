import { BaseConnectionMethods } from './types/connection';
import DataDefinitionQueryManager from '../DataDefinitionQueryManager';
import { AllowedPostgresTypes } from './types/types';
import PostgresCreateTableBuilder from './query-builders/PostgresTableBuilder';

class DataDefinitionPostgresQueryManager extends DataDefinitionQueryManager<AllowedPostgresTypes> {
  protected readonly dbConnection: BaseConnectionMethods;

  public constructor(dbConnection: BaseConnectionMethods) {
    super({
      tableBuilder: new PostgresCreateTableBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query(queryString: string): Promise<unknown> {
    return await this.dbConnection.query(queryString);
  }
}

export default DataDefinitionPostgresQueryManager;
