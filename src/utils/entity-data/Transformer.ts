import { ObjectType, PropertyClassType } from '../../types/object';
import { EntityDataProvider, EntityDataStore } from './index';
import {
  ColumnCondition,
  isLogicalWhere,
  Where,
} from '../../drivers/types/where';
import { EntityTableAndColumns } from '../../types/entity-data/entity';
import WrongWhereParamsToQuery from '../../error/WrongWhereParamsToQuery';

class Transformer {
  public static transformArrayToEntities<Entity>(
    objectsToTransform: ObjectType[],
    entityClass: PropertyClassType<Entity>,
  ): Entity[] {
    return objectsToTransform.map((objectToTransform) =>
      Transformer.transformToEntity(objectToTransform, entityClass),
    );
  }

  public static transformToEntity<Entity>(
    objectToTransform: ObjectType,
    entityClass: PropertyClassType<Entity>,
  ): Entity {
    const entity = new entityClass();

    const entityData = EntityDataStore.getEntityDataOrThrowError(
      entityClass,
      entity.constructor.name,
    );

    const columnNames = [...entityData.columns, ...entityData.primaryColumns];

    columnNames.forEach((columnName: string) => {
      const columnData = entityData.columnsData.get(columnName);

      const dbColumnName = columnData?.customName?.columnName || columnName;

      entity[columnName] = objectToTransform[dbColumnName];
    });

    return entity;
  }

  public static prepareWhereBeforeRequest(
    where: Where<string>,
    entityData: EntityTableAndColumns,
  ): Where<string> {
    let preparedWhere: Where<string>;

    if (isLogicalWhere(where)) {
      preparedWhere = {
        logicalOperator: where.logicalOperator,
        conditions: where.conditions.map((condition) =>
          this.prepareWhereBeforeRequest(condition, entityData),
        ),
      };
    } else {
      const preparedColumnConditions: ColumnCondition<string> = {};

      const columnKeys = Object.keys(where);
      columnKeys.forEach((columnKey) => {
        if (
          !entityData.columns.includes(columnKey) &&
          !entityData.primaryColumns.includes(columnKey)
        ) {
          throw new WrongWhereParamsToQuery(
            `Only ${entityData.tableName} entity properties are available. Relation fields are forbidden`,
          );
        }

        const columnData = entityData.columnsData.get(columnKey);

        const tableColumnKey = EntityDataProvider.getTableColumnKey(
          columnKey,
          columnData,
        );
        preparedColumnConditions[tableColumnKey] = where[columnKey];
      });

      preparedWhere = preparedColumnConditions;
    }

    return preparedWhere;
  }
}

export default Transformer;
