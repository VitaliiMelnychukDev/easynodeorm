import DataManipulationQueryManager from '../DataManipulationQueryManager';

class MySQLQueryManager extends DataManipulationQueryManager {
  public constructor() {
    super({});
  }

  async query<T>(queryString: string): Promise<T> {
    return Promise.resolve(queryString as T);
  }
}

export default MySQLQueryManager;
