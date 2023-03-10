import { ObjectType, PropertyClassType } from '../../types/object';
import { EntityDataStore } from './index';

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
}

export default Transformer;
