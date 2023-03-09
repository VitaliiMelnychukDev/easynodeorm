import BaseQueryManager from './BaseQueryManager';
import { PropertyClassType } from '../types/object';
import { EntityDataManager } from '../utils/entity-data';
import { InsertBuilderRows } from './types/insertBuilder';

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
  async createOne(entity: Entity): Promise<Entity> {
    const insertData = EntityDataManager.validateAndGetEntityData(
      entity,
      this.entityClass,
    );

    const queryResult = await this.queryManager.insert(insertData.tableName, [
      insertData.columns,
    ]);

    return queryResult as Entity;
  }

  async createMany(entity: Entity[]): Promise<Entity[]> {
    let tableName = '';
    const properties: InsertBuilderRows = [];
    entity.forEach((entity: Entity) => {
      const insertData = EntityDataManager.validateAndGetEntityData(
        entity,
        this.entityClass,
      );
      tableName = insertData.tableName;
      properties.push(insertData.columns);
    });

    return this.queryManager.insert(tableName, properties);
  }
}

export default BaseRepository;
