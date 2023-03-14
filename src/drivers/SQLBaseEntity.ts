import DataManipulationQueryManager from './DataManipulationQueryManager';
import BaseRepository from './BaseRepository';
import { PropertyClassType } from '../types/object';
import DataDefinitionQueryManager from './DataDefinitionQueryManager';

abstract class SQLBaseEntity<AllowedTypes> {
  abstract readonly queryManager: DataManipulationQueryManager;

  abstract readonly dataDefinitionQueryManager: DataDefinitionQueryManager<AllowedTypes>;

  abstract getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity>;

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

export default SQLBaseEntity;
