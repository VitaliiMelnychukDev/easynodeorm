import { SupportedDatabases } from '../types/global';

/* eslint-disable */
class DriverLoader {
  public static load(dbName: SupportedDatabases): any {
    switch (dbName) {
      case 'postgres':
        return require('pg');
      default:
        throw new Error('Only postgres database is supported');
    }
  }
}
/* eslint-enable */

export default DriverLoader;
