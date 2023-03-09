import { SupportedDatabases } from '../types/global';

/* eslint-disable */
class DriverLoader {
  public static load(dbName: SupportedDatabases): any {
    switch (dbName) {
      case 'postgres':
        return require('pg');
      case 'mysql':
        return require('mysql');
      default:
        throw new Error('Only postgres and mysql databases are supported');
    }
  }
}
/* eslint-enable */

export default DriverLoader;
