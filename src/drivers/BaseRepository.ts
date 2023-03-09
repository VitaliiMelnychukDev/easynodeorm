import BaseQueryManager from './BaseQueryManager';
import EntityDataGetter from '../helpers/entity/EntityDataGetter';

class BaseRepository<Entity> {
  protected readonly queryManager: BaseQueryManager;

  constructor(queryManager: BaseQueryManager) {
    this.queryManager = queryManager;
  }
  async save(entity: Entity): Promise<Entity> {
    const data = new EntityDataGetter(entity).validateAndGetEntityData();
    console.log('Data: ', data);
    return this.queryManager.insert('test', []);
  }
}

export default BaseRepository;
