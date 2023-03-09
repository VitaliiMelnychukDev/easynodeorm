import BaseQueryManager from './BaseQueryManager';
import { PropertyClassType } from '../types/object';
import { EntityDataManager } from '../utils/entity-data';

class BaseRepository<Entity> {
  protected readonly queryManager: BaseQueryManager;

  protected readonly entityClass: PropertyClassType<Entity>;

  constructor(
    queryManager: BaseQueryManager,
    entityClass: PropertyClassType<Entity>,
  ) {
    this.queryManager = queryManager;
    this.entityClass = entityClass;
  }
  async save(entity: Entity): Promise<Entity> {
    const data = EntityDataManager.validateAndGetEntityData(entity);
    console.log('Data: ', data);
    return this.queryManager.insert('test', []);
  }
}

export default BaseRepository;
