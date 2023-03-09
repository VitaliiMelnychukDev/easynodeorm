import { SetPropertyValidationProps } from '../../types/entity-data/store';
import { ColumnData } from '../../types/entity-data/column';
import {
  EntityData,
  EntityDataStoreKeyType,
  EntityDataStoreType,
} from '../../types/entity-data/entity';
import { ObjectType, PropertyClassType } from '../../types/object';
import WrongEntityError from '../../error/WrongEntityError';
import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';

class Store {
  private static readonly entityDataStore: EntityDataStoreType = new Map<
    EntityDataStoreKeyType,
    EntityData
  >();
  public static setPropertyValidation({
    target,
    propertyKey,
    decoratorKey,
    decoratorProps,
  }: SetPropertyValidationProps): void {
    if (typeof propertyKey !== 'string') return;
    const entityData = Store.getExistedEntityDataOrCreate(target);

    const propertyValidations = entityData.validations.has(propertyKey)
      ? entityData.validations.get(propertyKey)
      : {};
    entityData.validations.set(propertyKey, {
      ...propertyValidations,
      [decoratorKey]: decoratorProps,
    });
  }

  public static setCustomTableName(
    target: ObjectType,
    tableName: string,
  ): void {
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.tableName = tableName;
  }

  public static setColumnProperties(
    target: ObjectType,
    propertyKey: string | symbol,
    columnProperties: ColumnDecoratorProps,
  ): void {
    if (typeof propertyKey !== 'string') return;
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.columns.push(propertyKey);

    if (
      !columnProperties.customName &&
      columnProperties.defaultValue === undefined
    )
      return;

    const columnsData: ColumnData = {
      ...(columnProperties.customName && {
        customName: {
          propertyName: propertyKey,
          columnName: columnProperties.customName,
        },
      }),
      ...(columnProperties.defaultValue !== undefined && {
        defaultValue: columnProperties.defaultValue,
      }),
    };

    entityData.columnsData.set(propertyKey, columnsData);
  }

  public static setPrimaryColumn(
    target: ObjectType,
    propertyKey: string | symbol,
  ): void {
    if (typeof propertyKey !== 'string') return;
    const entityData = Store.getExistedEntityDataOrCreate(target);

    if (!entityData.primaryColumns.includes(propertyKey)) {
      entityData.primaryColumns.push(propertyKey);
    }
  }

  public static setPrimaryAutoIncrementColumn(
    target: ObjectType,
    propertyKey: string | symbol,
  ): void {
    if (typeof propertyKey !== 'string') return;
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.autoIncrementColumn = propertyKey;
    Store.setPrimaryColumn(target, propertyKey);
  }

  public static getEntityDataByFunction(
    fC: EntityDataStoreKeyType,
  ): EntityData | undefined {
    return this.entityDataStore.get(fC);
  }

  public static getEntityDataOrThrowError(
    entity: PropertyClassType<unknown>,
    entityName = '',
  ): EntityData {
    const entityData = Store.getEntityDataByFunction(entity);

    if (!entityData) {
      throw new WrongEntityError(
        `Entity ${entityName} is not valid. Please set column decorators`,
      );
    }

    return entityData;
  }

  private static getExistedEntityDataOrCreate(target: ObjectType): EntityData {
    if (!Store.getEntityDataByFunction(target.constructor)) {
      this.entityDataStore.set(target.constructor, new EntityData());
    }

    return this.entityDataStore.get(target.constructor);
  }
}

export default Store;
