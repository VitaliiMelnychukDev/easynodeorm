import SQLBaseDriver from '../SQLBaseDriver';
import { ConnectionOptions } from '../../types/connection';
import ConnectionHelper from './helpers/Connection';
import PostgresQueryManager from './PostgresQueryManager';
import { PostgresConnection } from './types/connection';
import BaseRepository from '../BaseRepository';
import { PropertyClassType } from '../../types/object';
import { AllowedTypes } from './types/types';
import DataDefinitionPostgresQueryManager from './DataDefinitionPostgresQueryManager';

class PostgresDriver extends SQLBaseDriver<AllowedTypes> {
  private readonly dbConnection: PostgresConnection;

  public readonly queryManager: PostgresQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionPostgresQueryManager;

  public constructor(options: ConnectionOptions) {
    super();

    const driver: any = SQLBaseDriver.getDriver(options.name);

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
}

export default PostgresDriver;
