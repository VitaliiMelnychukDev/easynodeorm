import DataManipulationQueryManager from './DataManipulationQueryManager';
import { ObjectType, PropertyClassType } from '../types/object';
import { EntityDataManager, EntityDataTransformer } from '../utils/entity-data';
import { InsertBuilderRows } from './types/insert';
import WrongQueryResult from '../error/WrongQueryResult';

class BaseRepository<Entity> {
  protected readonly queryManager: DataManipulationQueryManager;

  protected readonly entityClass: PropertyClassType<Entity>;

  constructor(
    queryManager: DataManipulationQueryManager,
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

    const createdEntries: ObjectType[] = await this.queryManager.insert(
      insertData.tableName,
      [insertData.columns],
    );

    if (!createdEntries.length) {
      throw new WrongQueryResult(
        'Something went wrong in process of inserting data',
      );
    }

    return EntityDataTransformer.transformToEntity(
      createdEntries[0],
      this.entityClass,
    );
  }

  async createMany(entity: Entity[]): Promise<Entity[]> {
    if (entity.length === 0) return [];

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

    const createdEntries: ObjectType[] = await this.queryManager.insert(
      tableName,
      properties,
    );

    if (!createdEntries.length) {
      throw new WrongQueryResult(
        'Something went wrong in process of inserting data',
      );
    }

    return EntityDataTransformer.transformArrayToEntities(
      createdEntries,
      this.entityClass,
    );
  }
}

export default BaseRepository;
