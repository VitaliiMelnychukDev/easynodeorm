import { ConnectionOptions } from '../../types/connection';
import ConnectionHelper from './helpers/Connection';
import MySqlQueryManager from './MySqlQueryManager';
import { MySqlPoolConnection } from './types/connection';
import BaseRepository from '../BaseRepository';
import { PropertyClassType } from '../../types/object';
import { AllowedMySqlTypes } from './types/types';
import DataDefinitionMySqlQueryManager from './DataDefinitionMySqlQueryManager';
import SqlBaseDriver from '../SqlBaseDriver';
import MysqlSeparateConnectionManager from './MysqlSeparateConnectionManager';

class MySqlDriver extends SqlBaseDriver<AllowedMySqlTypes> {
  private readonly dbConnection: MySqlPoolConnection;

  public readonly queryManager: MySqlQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionMySqlQueryManager;

  public constructor(options: ConnectionOptions) {
    super();

    const driver: any = SqlBaseDriver.getDriver(options.name);

    this.dbConnection = driver.createPool(
      ConnectionHelper.mapToConnectionObject(options),
    );

    this.queryManager = new MySqlQueryManager(this.dbConnection);
    this.dataDefinitionQueryManager = new DataDefinitionMySqlQueryManager(
      this.dbConnection,
    );
  }

  getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager, entityClass);
  }

  async getSeparateConnection(): Promise<MysqlSeparateConnectionManager> {
    const connection = await this.dbConnection.getConnection();

    return new MysqlSeparateConnectionManager(connection);
  }
}

export default MySqlDriver;
