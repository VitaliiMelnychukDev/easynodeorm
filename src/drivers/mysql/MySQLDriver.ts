import MySQLQueryManager from './MySQLQueryManager';
import SQLBaseDriver from '../SQLBaseDriver';
import BaseRepository from '../BaseRepository';
import { PropertyClassType } from '../../types/object';
import DataDefinitionMySQLQueryManager from './DataDefinitionMySQLQueryManager';

class MySQLDriver extends SQLBaseDriver<'string'> {
  public readonly queryManager: MySQLQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionMySQLQueryManager;

  constructor() {
    super();

    this.queryManager = new MySQLQueryManager();
    this.dataDefinitionQueryManager = new DataDefinitionMySQLQueryManager();
  }

  getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager, entityClass);
  }
}

export default MySQLDriver;
