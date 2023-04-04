import { BaseConnectionMethods } from './types/connection';
import DataDefinitionQueryManager from '../DataDefinitionQueryManager';
import { AllowedMySqlTypes } from './types/types';
import MySqlIndexBuilder from './query-builders/MySqlIndexBuilder';

class DataDefinitionMySqlQueryManager extends DataDefinitionQueryManager<AllowedMySqlTypes> {
  protected readonly dbConnection: BaseConnectionMethods;

  public constructor(dbConnection: BaseConnectionMethods) {
    super({
      indexBuilder: new MySqlIndexBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query(queryString: string): Promise<unknown> {
    return await this.dbConnection.query(queryString);
  }
}

export default DataDefinitionMySqlQueryManager;
