import MySQLQueryManager from './MySQLQueryManager';
import SQLBaseDriver from '../SQLBaseDriver';
import BaseRepository from '../BaseRepository';
import { PropertyClassType } from '../../types/object';

class MySQLDriver extends SQLBaseDriver {
  public readonly queryManager: MySQLQueryManager;

  constructor() {
    super();

    this.queryManager = new MySQLQueryManager();
  }

  getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager, entityClass);
  }
}

export default MySQLDriver;
