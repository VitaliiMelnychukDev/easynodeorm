import DataSource from '../data-source/DataSource';

const postgresDataSource = DataSource.getDataSource<'postgres'>({
  name: 'postgres',
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
