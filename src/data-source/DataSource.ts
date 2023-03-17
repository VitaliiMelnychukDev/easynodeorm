import { ConnectionOptions } from '../types/connection';
import PostgresDriver from '../drivers/postgress/PostgresDriver';
import { SupportedDatabaseNames, SupportedDatabases } from '../types/global';
import { Driver } from '../types/driver';

class DataSource {
  public static getDataSource<T extends SupportedDatabases>(
    options: ConnectionOptions,
  ): Driver[T] {
    switch (options.name) {
      case SupportedDatabaseNames.Postgres:
        return new PostgresDriver(options) as Driver[T];
      default:
        throw new Error("Only Postgres db's are supported");
    }
  }
}

export default DataSource;
