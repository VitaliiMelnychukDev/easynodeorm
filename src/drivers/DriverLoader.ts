import { SupportedDatabaseNames, SupportedDatabases } from '../types/global';

class DriverLoader {
  public static load(dbName: SupportedDatabases): any {
    switch (dbName) {
      case SupportedDatabaseNames.Postgres:
        return require('pg');
      case SupportedDatabaseNames.MySql:
        return require('mysql2/promise');
      default:
        throw new Error('Only postgres and mysql databases are supported');
    }
  }
}

export default DriverLoader;
