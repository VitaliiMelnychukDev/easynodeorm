import { BaseConnectionMethods } from './types/connection';
import DataManipulationQueryManager from '../DataManipulationQueryManager';
import MySqlInsertBuilder from './query-builders/MySqlInsertBuilder';
import { Operation } from '../consts/operation';

class MySqlQueryManager extends DataManipulationQueryManager {
  protected readonly dbConnection: BaseConnectionMethods;

  public constructor(dbConnection: BaseConnectionMethods) {
    super({
      insertBuilder: new MySqlInsertBuilder(),
    });
    this.dbConnection = dbConnection;
  }

  async query<T>(queryString: string, operation: string): Promise<T[]> {
    const result: any = await this.dbConnection.query(queryString);

    if (operation === Operation.Insert) {
      return result && result.length && result[0].length > 1
        ? result[0][1]
        : [];
    } else if (operation === Operation.Select) {
      return result && result.length && result[0].length ? result[0] : [];
    }

    return [];
  }
}

export default MySqlQueryManager;
