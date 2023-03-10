import { SupportedDatabases } from '../types/global';
import DriverLoader from './DriverLoader';
import DataManipulationQueryManager from './DataManipulationQueryManager';
import BaseRepository from './BaseRepository';
import { PropertyClassType } from '../types/object';
import DataDefinitionQueryManager from './DataDefinitionQueryManager';

abstract class SQLBaseDriver<AllowedTypes> {
  abstract readonly queryManager: DataManipulationQueryManager;

  abstract readonly dataDefinitionQueryManager: DataDefinitionQueryManager<AllowedTypes>;

  abstract getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity>;

  static getDriver(dbName: SupportedDatabases): any {
    return DriverLoader.load(dbName);
  }

  getCustomRepository<Entity, CustomRepository extends BaseRepository<Entity>>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    repository: Function,
    entityClass: PropertyClassType<Entity>,
  ): CustomRepository {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new repository<Entity>(this.queryManager, entityClass);
  }
}

export default SQLBaseDriver;
