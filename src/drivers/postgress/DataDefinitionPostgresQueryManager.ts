import { PostgresConnection } from './types/connection';
import DataDefinitionQueryManager from '../DataDefinitionQueryManager';
import { AllowedTypes } from './types/types';
import PostgresCreateTableBuilder from './PostgressCreateTableBuilder';

class DataDefinitionPostgresQueryManager extends DataDefinitionQueryManager<AllowedTypes> {
  protected readonly dbConnection: PostgresConnection;

  public constructor(dbConnection: any) {
    super({
      createTableBuilder: new PostgresCreateTableBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query(queryString: string): Promise<unknown> {
    return await this.dbConnection.query(queryString);
  }
}

export default DataDefinitionPostgresQueryManager;