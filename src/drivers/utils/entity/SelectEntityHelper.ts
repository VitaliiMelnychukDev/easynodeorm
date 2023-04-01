import BaseEntityHelper from './BaseEntityHelper';
import { JoinVariant, Where, WithRelations } from '../../types';
import {
  EntityDataManager,
  EntityDataProvider,
  EntityDataStore,
  EntityDataTransformer,
} from '../../../utils/entity-data';
import {
  EntityDataStoreKey,
  EntityRelation,
} from '../../../types/entity-data/entity';
import { RelationType } from '../../../types/entity-data/relations';

class SelectEntityHelper extends BaseEntityHelper {
  async getOne<Entity>(
    where: Where<keyof Entity>,
    entityClass: EntityDataStoreKey,
  ): Promise<Entity | null> {
    const entities = await this.selectByWhere<Entity>(where, entityClass);

    return entities.length ? entities[0] : null;
  }
  async populate<Entity>(
    entity: Entity,
    entityClass: EntityDataStoreKey,
    withRelations: WithRelations<Entity>[] = [],
  ): Promise<Entity> {
    const relations = EntityDataManager.validateAndGetRelations(
      entityClass,
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
  private async populateOneToRelations<Entity>(
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

  public async populateManyToManyRelation<Entity>(
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
            joinedTableColumn: `${relatedTableName}.${relation.intermediateTable.fieldNames.relatedEntityField}`,
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
  public async selectByWhere<EntityClass>(
    where: Where<string>,
    entityClass: EntityDataStoreKey,
  ): Promise<EntityClass[]> {
    const entityData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const transformedWhereToSelect = EntityDataTransformer.prepareWhereForQuery(
      where,
      entityData,
    );

    const entities = await this.queryManager.select({
      table: entityData.tableName,
      where: transformedWhereToSelect,
    });

    return EntityDataTransformer.transformArrayToEntities(
      entities,
      entityClass,
    );
  }
}

export default SelectEntityHelper;
