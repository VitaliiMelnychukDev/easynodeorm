import PostgresDriver from '../drivers/postgress/PostgresDriver';
import MySqlDriver from '../drivers/mysql/MySqlDriver';

export type Driver = {
  postgres: PostgresDriver;
  mysql: MySqlDriver;
};
