import DataSource from '../data-source/DataSource';
import { SupportedDatabaseNames } from '../types/global';

const postgresDataSource =
  DataSource.getDataSource<SupportedDatabaseNames.Postgres>({
    name: SupportedDatabaseNames.Postgres,
    host: 'localhost',
    user: 'postgres',
    database: 'easynode',
    password: 'test1234',
    maxConnection: 20,
    timeouts: {
      idle: 30000,
      connection: 20000,
    },
  });

export default postgresDataSource;
