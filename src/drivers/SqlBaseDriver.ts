import SQLBaseEntity from './SQLBaseEntity';
import { SupportedDatabases } from '../types/global';
import DriverLoader from './DriverLoader';
import BaseSeparateConnectionManager from './BaseSeparateConnectionManager';

abstract class SqlBaseDriver<AllowedTypes> extends SQLBaseEntity<AllowedTypes> {
  static getDriver(dbName: SupportedDatabases): any {
    return DriverLoader.load(dbName);
  }

  abstract getSeparateConnection(): Promise<
    BaseSeparateConnectionManager<AllowedTypes>
  >;
}

export default SqlBaseDriver;
