import BaseQueryManager from '../BaseQueryManager';

class MySQLQueryManager extends BaseQueryManager {
  public constructor() {
    super({});
  }

  async query<T>(queryString: string): Promise<T> {
    return Promise.resolve(queryString as T);
  }
}

export default MySQLQueryManager;
