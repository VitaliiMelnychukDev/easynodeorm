import DataManipulationQueryManager from '../../DataManipulationQueryManager';
import {
  EntityDataStoreKey,
  EntityRelation,
} from '../../../types/entity-data/entity';
import { Where, WithRelations } from '../../types';
import WrongEntityToInsert from '../../../error/WrongEntityToInsert';
import { EntityDataManager } from '../../../utils/entity-data';
import WrongEntityError from '../../../error/WrongEntityError';

abstract class BaseEntityHelper {
  protected queryManager: DataManipulationQueryManager;
  constructor(queryManager: DataManipulationQueryManager) {
    this.queryManager = queryManager;
  }

  protected getRelationNamesToHandle<Entity>(
    relations: Record<string, EntityRelation>,
    withRelations: WithRelations<Entity>[] = [],
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

  protected getPrimaryKeysWherePart<Entity>(
    entity: Entity,
    entityClass: EntityDataStoreKey,
  ): Where<keyof Entity> {
    const entityData =
      EntityDataManager.validateAndGetTableAndColumnsData(entityClass);

    const where: Where<keyof Entity> = {};
    entityData.primaryColumns.forEach((primaryColumn) => {
      if (!entity[primaryColumn]) {
        throw new WrongEntityError(
          `entity primaryColumn ${primaryColumn} can not be empty`,
        );
      }

      where[primaryColumn] = entity[primaryColumn];
    });

    return where;
  }
}

export default BaseEntityHelper;
