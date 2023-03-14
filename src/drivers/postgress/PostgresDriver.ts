import { ConnectionOptions } from '../../types/connection';
import ConnectionHelper from './helpers/Connection';
import PostgresQueryManager from './PostgresQueryManager';
import { PostgresPoolConnection } from './types/connection';
import BaseRepository from '../BaseRepository';
import { PropertyClassType } from '../../types/object';
import { AllowedTypes } from './types/types';
import DataDefinitionPostgresQueryManager from './DataDefinitionPostgresQueryManager';
import SqlBaseDriver from '../SqlBaseDriver';
import PostgresSeparateConnectionManager from './PostgresSeparateConnectionManager';

class PostgresDriver extends SqlBaseDriver<AllowedTypes> {
  private readonly dbConnection: PostgresPoolConnection;

  public readonly queryManager: PostgresQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionPostgresQueryManager;

  public constructor(options: ConnectionOptions) {
    super();

    const driver: any = SqlBaseDriver.getDriver(options.name);

    this.dbConnection = new driver.Pool(
      ConnectionHelper.mapToConnectionObject(options),
    );

    this.queryManager = new PostgresQueryManager(this.dbConnection);
    this.dataDefinitionQueryManager = new DataDefinitionPostgresQueryManager(
      this.dbConnection,
    );
  }

  getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager, entityClass);
  }

  async getSeparateConnection(): Promise<PostgresSeparateConnectionManager> {
    const connection = await this.dbConnection.connect();

    return new PostgresSeparateConnectionManager(connection);
  }
}

export default PostgresDriver;
