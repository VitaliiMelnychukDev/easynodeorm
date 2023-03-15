import DataManipulationQueryManager from './DataManipulationQueryManager';
import { ObjectType, PropertyClassType } from '../types/object';
import {
  EntityDataManager,
  EntityDataProvider,
  EntityDataStore,
  EntityDataTransformer,
} from '../utils/entity-data';
import { InsertBuilderRows } from './types/insert';
import WrongQueryResult from '../error/WrongQueryResult';
import { RelationType } from '../types/entity-data/relations';
import WrongEntityToInsert from '../error/WrongEntityToInsert';
import { EntityRelation } from '../types/entity-data/entity';
import { Where } from './types/where';
import { JoinVariant } from './types/join';

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
  async create(
    entity: Entity,
    withRelations: (keyof Entity | 'all')[] = [],
  ): Promise<Entity> {
    let entityToReturn = entity;
    const relations = EntityDataManager.validateAndGetRelation(
      this.entityClass,
      entity,
    );

    const oneToOneRelationInsertResults = {};

    const relationsToHandle = this.getRelationNamesToHandle(
      relations,
      withRelations,
    );

    for (const relationToHandle of relationsToHandle) {
      const relation = relations[relationToHandle];
      if (relation.relationType === RelationType.OneToOne) {
        entityToReturn = await this.handleAndInsertOneToOneRelatedEntity(
          entityToReturn,
          relationToHandle,
          relation,
        );
        oneToOneRelationInsertResults[relationToHandle] =
          entityToReturn[relationToHandle];
      }
    }

    const entitiesData = await this.createEntities(
      [entityToReturn],
      this.entityClass,
    );

    for (const entityPropertyKey in entitiesData[0]) {
      entityToReturn[entityPropertyKey] = entitiesData[0][entityPropertyKey];
    }

    for (const key in oneToOneRelationInsertResults) {
      entityToReturn[key] = oneToOneRelationInsertResults[key];
    }

    for (const relationToHandle of relationsToHandle) {
      const relation = relations[relationToHandle];
      if (relation.relationType === RelationType.OneToMany) {
        entityToReturn = await this.handleAndInsertOneToManyRelatedEntities(
          entityToReturn,
          relationToHandle,
          relation,
        );
      }
      if (relation.relationType === RelationType.ManyToMany) {
        await this.handleAndInsertManyToManyRelatedEntities(
          entityToReturn,
          relationToHandle,
          relation,
        );
      }
    }

    return entityToReturn;
  }

  async get(where: Where<keyof Entity>): Promise<Entity[]> {
    return await this.selectByWhere(where, this.entityClass);
  }

  async populate(
    entity: Entity,
    withRelations: (keyof Entity | 'all')[] = [],
  ): Promise<Entity> {
    const relations = EntityDataManager.validateAndGetRelation(
      this.entityClass,
      entity,
    );

    const relationsToHandle = this.getRelationNamesToHandle(
      relations,
      withRelations,
    );

    for (const relationToHandle of relationsToHandle) {
      const relation = relations[relationToHandle];

      if (relation.relationType !== RelationType.ManyToMany) {
        await this.populateOneToRelations(entity, relationToHandle, relation);
      } else {
        await this.populateManyToManyRelation(
          entity,
          relationToHandle,
          relation,
        );
      }
    }

    return entity;
  }

  private async populateOneToRelations(
    entity: Entity,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<Entity> {
    const rawEntities = await this.selectByWhere(
      {
        [relation.relatedEntityField]: entity[relation.field],
      },
      relation.getRelatedEntity(),
    );

    if (relation.relationType === RelationType.OneToMany) {
      entity[entityRelationFieldName] = rawEntities;
    } else if (rawEntities.length) {
      entity[entityRelationFieldName] = rawEntities[0];
    }

    return entity;
  }

  private async populateManyToManyRelation(
    entity: Entity,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<Entity> {
    const intermediateTableName = relation.intermediateTable.name;
    const relatedTableEntityData = EntityDataStore.getEntityDataOrThrowError(
      relation.getRelatedEntity(),
    );
    const relatedTableName = relatedTableEntityData.tableName;

    const columnsToSelect = EntityDataProvider.getEntityColumns(
      relatedTableEntityData,
    ).map((columnToSelect) => `${relatedTableName}.${columnToSelect}`);

    const rawEntities = await this.queryManager.select({
      table: intermediateTableName,
      columns: columnsToSelect,
      joins: [
        {
          type: JoinVariant.Left,
          table: relatedTableName,
          on: {
            column: `${intermediateTableName}.${relation.intermediateTable.fieldNames.relatedTableIntermediateField}`,
            joinTableColumn: `${relatedTableName}.${relation.intermediateTable.fieldNames.relatedEntityField}`,
          },
        },
      ],
      where: {
        [relation.intermediateTable.fieldNames.currentTableIntermediateField]:
          entity[relation.intermediateTable.fieldNames.currentEntityField],
      },
    });

    entity[entityRelationFieldName] =
      EntityDataTransformer.transformArrayToEntities(
        rawEntities,
        relation.getRelatedEntity(),
      );

    return entity;
  }

  private async selectByWhere<T>(
    where: Where<string>,
    entityClass: PropertyClassType<T>,
  ): Promise<T[]> {
    const data =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const transformedWhereToSelect =
      EntityDataTransformer.prepareWhereBeforeRequest(where, data);

    const entities = await this.queryManager.select({
      table: data.tableName,
      where: transformedWhereToSelect,
    });

    return EntityDataTransformer.transformArrayToEntities(
      entities,
      entityClass,
    );
  }

  private getRelationNamesToHandle(
    relations: Record<string, EntityRelation>,
    withRelations: (keyof Entity | 'all')[] = [],
  ): string[] {
    const relationKeys = Object.keys(relations);

    return withRelations.includes('all')
      ? relationKeys
      : withRelations.map((relationName) => {
          const relationStringName = String(relationName);
          if (!relationKeys.includes(relationStringName)) {
            throw new WrongEntityToInsert(
              `entity should contain valid ${relationStringName}`,
            );
          }

          return relationStringName;
        });
  }

  private async handleAndInsertOneToOneRelatedEntity<T>(
    entity: T,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<T> {
    if (!entity[entityRelationFieldName]) {
      throw new WrongEntityToInsert(
        `entity should contain valid ${entityRelationFieldName}`,
      );
    }

    const entitiesData = await this.createEntities(
      [entity[entityRelationFieldName]],
      relation.getRelatedEntity(),
    );

    entity[entityRelationFieldName] = entitiesData[0];
    entity[relation.field] = entitiesData[0][relation.relatedEntityField];

    return entity;
  }
  private async handleAndInsertOneToManyRelatedEntities<T>(
    entity: T,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<T> {
    if (!entity[entityRelationFieldName]) {
      throw new WrongEntityToInsert(
        `entity should contain valid ${entityRelationFieldName}`,
      );
    }

    if (!Array.isArray(entity[entityRelationFieldName])) {
      throw new WrongEntityToInsert(
        `entity should contain valid ${entityRelationFieldName} array`,
      );
    }
    const oneToManyEntitiesToSave = entity[entityRelationFieldName].map(
      (entityToSave) => {
        entityToSave[relation.relatedEntityField] = entity[relation.field];

        return entityToSave;
      },
    );

    entity[entityRelationFieldName] = await this.createEntities(
      oneToManyEntitiesToSave,
      relation.getRelatedEntity(),
    );

    return entity;
  }
  private async handleAndInsertManyToManyRelatedEntities<T>(
    entity: T,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<void> {
    if (!entity[entityRelationFieldName]) {
      throw new WrongEntityToInsert(
        `entity should contain valid ${entityRelationFieldName}`,
      );
    }
    if (!Array.isArray(entity[entityRelationFieldName])) {
      throw new WrongEntityToInsert(
        `entity should contain valid ${entityRelationFieldName} array`,
      );
    }
    const relatedEntitiesIds = entity[entityRelationFieldName].map(
      (relatedEntity) => {
        const relatedEntityField =
          relatedEntity[
            relation.intermediateTable.fieldNames.relatedEntityField
          ];
        if (!relatedEntityField) {
          throw new WrongEntityToInsert(
            `entity should contain valid ${entityRelationFieldName} array`,
          );
        }

        return relatedEntityField;
      },
    );

    const entityId =
      entity[relation.intermediateTable.fieldNames.currentEntityField];

    const propertiesToInsert: InsertBuilderRows = relatedEntitiesIds.map(
      (relatedEntitiesId) => {
        return [
          {
            name: relation.intermediateTable.fieldNames
              .currentTableIntermediateField,
            value: entityId,
          },
          {
            name: relation.intermediateTable.fieldNames
              .relatedTableIntermediateField,
            value: relatedEntitiesId,
          },
        ];
      },
    );

    await this.insertData(relation.intermediateTable.name, propertiesToInsert);
  }

  private async createEntities<T>(
    entity: T[],
    entityClass: PropertyClassType<T>,
  ): Promise<T[]> {
    if (entity.length === 0) return [];

    let tableName = '';
    const properties: InsertBuilderRows = [];
    entity.forEach((entity: T) => {
      const insertData = EntityDataManager.validateAndGetEntityData(
        entityClass,
        entity,
      );
      tableName = insertData.tableName;
      properties.push(insertData.columns);
    });

    const createdEntries: ObjectType[] = await this.insertData(
      tableName,
      properties,
    );

    return EntityDataTransformer.transformArrayToEntities(
      createdEntries,
      entityClass,
    );
  }

  private async insertData(
    tableName: string,
    rows: InsertBuilderRows,
  ): Promise<ObjectType[]> {
    const createdEntries: ObjectType[] = await this.queryManager.insert(
      tableName,
      rows,
    );

    if (!createdEntries.length) {
      throw new WrongQueryResult(
        'Something went wrong in process of inserting data',
      );
    }

    return createdEntries;
  }
}

export default BaseRepository;
