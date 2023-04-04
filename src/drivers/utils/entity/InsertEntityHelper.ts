import {
  EntityDataStoreKey,
  EntityRelation,
} from '../../../types/entity-data/entity';
import WrongEntityToInsert from '../../../error/WrongEntityToInsert';
import { ObjectType } from '../../../types/object';
import { InsertOptions, RowsToInsert, WithRelations } from '../../types';
import {
  EntityDataManager,
  EntityDataTransformer,
} from '../../../utils/entity-data';
import BaseEntityHelper from './BaseEntityHelper';
import { RelationType } from '../../../types/entity-data/relations';

class InsertEntityHelper extends BaseEntityHelper {
  async create<Entity>(
    entity: Entity,
    withRelations: WithRelations<Entity>[] = [],
    entityClass: EntityDataStoreKey,
  ): Promise<Entity> {
    let entityToReturn = entity;
    const relations = EntityDataManager.validateAndGetRelations(
      entityClass,
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
      entityClass,
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

  public async handleAndInsertOneToOneRelatedEntity<EntityClass>(
    entity: EntityClass,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<EntityClass> {
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

  public async handleAndInsertOneToManyRelatedEntities<EntityClass>(
    entity: EntityClass,
    entityRelationFieldName: string,
    relation: EntityRelation,
  ): Promise<EntityClass> {
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

  public async handleAndInsertManyToManyRelatedEntities<EntityClass>(
    entity: EntityClass,
    entityRelationFieldName: string,
    relation: EntityRelation,
    removeExisted = false,
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

    const propertiesToInsert: RowsToInsert = relatedEntitiesIds.map(
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

    if (removeExisted) {
      await this.queryManager.delete({
        tableName: relation.intermediateTable.name,
        where: {
          [relation.intermediateTable.fieldNames.currentTableIntermediateField]:
            entityId,
        },
      });
    }

    await this.insertData(
      relation.intermediateTable.name,
      propertiesToInsert,
      {},
    );
  }

  public async createEntities<EntityClass>(
    entity: EntityClass[],
    entityClass: EntityDataStoreKey,
  ): Promise<EntityClass[]> {
    if (entity.length === 0) return [];

    let tableName = '';
    const properties: RowsToInsert = [];
    entity.forEach((entity: EntityClass) => {
      const insertData = EntityDataManager.validateAndGetDataForOperation(
        entityClass,
        entity,
      );
      tableName = insertData.tableName;
      properties.push(insertData.columns);
    });

    const tableAndColumnsData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);
    const singlePrimaryKeyFieldName =
      tableAndColumnsData.primaryColumns.length === 1
        ? tableAndColumnsData.primaryColumns[0]
        : '';
    const createdEntries: ObjectType[] = await this.insertData(
      tableName,
      properties,
      {
        ...(singlePrimaryKeyFieldName && { singlePrimaryKeyFieldName }),
      },
    );

    return EntityDataTransformer.transformArrayToEntities(
      createdEntries,
      entityClass,
    );
  }

  private async insertData(
    tableName: string,
    rows: RowsToInsert,
    options: InsertOptions,
  ): Promise<ObjectType[]> {
    return await this.queryManager.insert(tableName, rows, options);
  }
}

export default InsertEntityHelper;
