import { ConnectionOptions } from '../types/connection';
import PostgresDriver from '../drivers/postgress/PostgresDriver';
import { SupportedDatabaseNames, SupportedDatabases } from '../types/global';
import { Driver } from '../types/driver';
import MySqlDriver from '../drivers/mysql/MySqlDriver';

class DataSource {
  public static getDataSource<T extends SupportedDatabases>(
    options: ConnectionOptions,
  ): Driver[T] {
    switch (options.name) {
      case SupportedDatabaseNames.Postgres:
        return new PostgresDriver(options) as Driver[T];
      case SupportedDatabaseNames.MySql:
        return new MySqlDriver(options) as Driver[T];
      default:
        throw new Error("Only Postgres and MySql db's are supported");
    }
  }
}

export default DataSource;
