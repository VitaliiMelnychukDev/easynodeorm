import { ConnectionOptions } from '../../types/connection';
import MySQLQueryManager from './MySQLQueryManager';
import SQLBaseDriver from '../SQLBaseDriver';
import BaseRepository from '../BaseRepository';

class MySQLDriver extends SQLBaseDriver {
  public readonly queryManager: MySQLQueryManager;

  constructor(options: ConnectionOptions) {
    super();

    console.log('Options: ', options);
    this.queryManager = new MySQLQueryManager();
  }

  getRepository<Entity>(): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager);
  }
}

export default MySQLDriver;
