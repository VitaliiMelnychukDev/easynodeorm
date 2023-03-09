import { SupportedDatabases } from '../types/global';
import DriverLoader from './DriverLoader';
import BaseQueryManager from './BaseQueryManager';
import BaseRepository from './BaseRepository';

abstract class SQLBaseDriver {
  abstract readonly queryManager: BaseQueryManager;

  abstract getRepository<Entity>(): BaseRepository<Entity>;

  static getDriver(dbName: SupportedDatabases): any {
    return DriverLoader.load(dbName);
  }

  getCustomRepository<
    Entity,
    CustomRepository extends BaseRepository<Entity>,
    // eslint-disable-next-line @typescript-eslint/ban-types
  >(repository: Function): CustomRepository {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new repository<Entity>(this.queryManager);
  }
}

export default SQLBaseDriver;
