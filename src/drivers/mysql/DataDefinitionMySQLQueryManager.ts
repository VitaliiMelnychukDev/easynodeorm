import DataDefinitionQueryManager from '../DataDefinitionQueryManager';

class DataDefinitionMySQLQueryManager extends DataDefinitionQueryManager<'string'> {
  public constructor() {
    super({});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async query(queryString: string): Promise<void> {
    return Promise.resolve();
  }
}

export default DataDefinitionMySQLQueryManager;
