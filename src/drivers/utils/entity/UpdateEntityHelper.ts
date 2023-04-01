import BaseEntityHelper from './BaseEntityHelper';
import DataManipulationQueryManager from '../../DataManipulationQueryManager';
import InsertEntityHelper from './InsertEntityHelper';
import SelectEntityHelper from './SelectEntityHelper';
import { UpdateEntity, Where, WithRelations } from '../../types';
import {
  EntityDataManager,
  EntityDataTransformer,
} from '../../../utils/entity-data';
import WrongQueryResult from '../../../error/WrongQueryResult';
import { RelationType } from '../../../types/entity-data/relations';
import { EntityDataStoreKey } from '../../../types/entity-data/entity';

class UpdateEntityHelper extends BaseEntityHelper {
  protected readonly insertEntityHelper: InsertEntityHelper;
  protected readonly selectEntityHelper: SelectEntityHelper;
  constructor(
    queryManager: DataManipulationQueryManager,
    insertEntityHelper: InsertEntityHelper,
    selectEntityHelper: SelectEntityHelper,
  ) {
    super(queryManager);
    this.insertEntityHelper = insertEntityHelper;
    this.selectEntityHelper = selectEntityHelper;
  }

  async updateEntity<Entity>(
    entity: Entity,
    entityClass: EntityDataStoreKey,
    withRelations: WithRelations<Entity>[] = [],
  ): Promise<Entity> {
    const entityData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const updatedData: UpdateEntity<Entity> = {};

    entityData.columns.forEach((column) => {
      updatedData[column] = entity[column];
    });

    const wherePart = this.getPrimaryKeysWherePart(entity, entityClass);

    const updatedEntities = await this.update(
      updatedData,
      entityClass,
      wherePart,
      true,
    );
    if (!updatedEntities.length) {
      throw new WrongQueryResult(
        'Something went wrong in process of updating data',
      );
    }
    const updatedEntity = updatedEntities[0];
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
      if (relation.relationType === RelationType.ManyToMany) {
        await this.insertEntityHelper.handleAndInsertManyToManyRelatedEntities(
          entity,
          relationToHandle,
          relation,
          true,
        );
        await this.selectEntityHelper.populateManyToManyRelation(
          updatedEntity,
          relationToHandle,
          relation,
        );
      }
    }

    return updatedEntity;
  }

  async update<Entity>(
    updatedFields: UpdateEntity<Entity>,
    entityClass: EntityDataStoreKey,
    where: Where<keyof Entity>,
    returnUpdated = false,
  ): Promise<Entity[]> {
    const entityData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const entities = await this.queryManager.update({
      tableName: entityData.tableName,
      where: EntityDataTransformer.prepareWhereForQuery(where, entityData),
      columns: EntityDataManager.validateAndGetColumnsPreparedData(
        entityClass,
        updatedFields,
      ),
      returnUpdatedRows: returnUpdated,
    });

    return returnUpdated
      ? EntityDataTransformer.transformArrayToEntities(entities, entityClass)
      : [];
  }
}

export default UpdateEntityHelper;
