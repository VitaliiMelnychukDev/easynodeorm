import PostgresDriver from '../drivers/postgress/PostgresDriver';
import MySQLDriver from '../drivers/mysql/MySQLDriver';

export type Driver = {
  postgres: PostgresDriver;
  mysql: MySQLDriver;
};
