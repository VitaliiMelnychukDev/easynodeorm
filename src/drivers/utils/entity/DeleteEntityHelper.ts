import BaseEntityHelper from './BaseEntityHelper';
import { Where } from '../../types';
import {
  EntityDataManager,
  EntityDataTransformer,
} from '../../../utils/entity-data';
import { EntityDataStoreKey } from '../../../types/entity-data/entity';

class DeleteEntityHelper extends BaseEntityHelper {
  async deleteEntity<Entity>(
    entity: Entity,
    entityClass: EntityDataStoreKey,
  ): Promise<void> {
    const wherePart = this.getPrimaryKeysWherePart(entity, entityClass);

    await this.delete(wherePart, entityClass);
  }
  async delete<Entity>(
    where: Where<keyof Entity>,
    entityClass: EntityDataStoreKey,
    returnDeleted = false,
  ): Promise<Entity[]> {
    const entityData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const entities = await this.queryManager.delete({
      tableName: entityData.tableName,
      where: EntityDataTransformer.prepareWhereForQuery(where, entityData),
      returnDeletedRows: returnDeleted,
    });

    return returnDeleted
      ? EntityDataTransformer.transformArrayToEntities(entities, entityClass)
      : [];
  }
}

export default DeleteEntityHelper;
