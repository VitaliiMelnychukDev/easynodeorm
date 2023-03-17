import { SupportedDatabaseNames, SupportedDatabases } from '../types/global';

class DriverLoader {
  public static load(dbName: SupportedDatabases): any {
    switch (dbName) {
      case SupportedDatabaseNames.Postgres:
        return require('pg');
      default:
        throw new Error('Only postgres database is supported');
    }
  }
}

export default DriverLoader;
