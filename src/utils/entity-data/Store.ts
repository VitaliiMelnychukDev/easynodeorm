import { SetPropertyValidationProps } from '../../types/entity-data/store';
import { ColumnData } from '../../types/entity-data/column';
import {
  EntityData,
  EntityDataStoreKeyType,
  EntityDataStoreType,
  EntityRelation,
} from '../../types/entity-data/entity';
import { ObjectType, PropertyClassType } from '../../types/object';
import WrongEntityError from '../../error/WrongEntityError';
import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';
import { RelationType } from '../../types/entity-data/relations';

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
    const propertyKeyName =
      Store.validateAndReturnStringPropertyKey(propertyKey);
    const entityData = Store.getExistedEntityDataOrCreate(target);

    const propertyValidations = entityData.validations.has(propertyKeyName)
      ? entityData.validations.get(propertyKeyName)
      : {};
    entityData.validations.set(propertyKeyName, {
      ...propertyValidations,
      [decoratorKey]: decoratorProps,
    });
  }

  public static setCustomTableName(
    target: ObjectType,
    tableName: string,
  ): void {
    if (!tableName) return;
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.tableName = tableName;
  }

  public static setColumnProperties(
    target: ObjectType,
    propertyKey: string | symbol,
    columnProperties: ColumnDecoratorProps,
  ): void {
    const propertyKeyName =
      Store.validateAndReturnStringPropertyKey(propertyKey);
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.columns.push(propertyKeyName);

    if (
      !columnProperties.customName &&
      columnProperties.defaultValue === undefined
    )
      return;

    const columnsData: ColumnData = {
      ...(columnProperties.customName && {
        customName: {
          propertyName: propertyKeyName,
          columnName: columnProperties.customName,
        },
      }),
      ...(columnProperties.defaultValue !== undefined && {
        defaultValue: columnProperties.defaultValue,
      }),
    };

    entityData.columnsData.set(propertyKeyName, columnsData);
  }

  public static setPrimaryColumn(
    target: ObjectType,
    propertyKey: string | symbol,
    customName?: ColumnDecoratorProps['customName'],
  ): void {
    const propertyKeyName =
      Store.validateAndReturnStringPropertyKey(propertyKey);
    const entityData = Store.getExistedEntityDataOrCreate(target);

    if (!entityData.primaryColumns.includes(propertyKeyName)) {
      entityData.primaryColumns.push(propertyKeyName);
    }

    if (customName) {
      entityData.columnsData.set(propertyKeyName, {
        customName: {
          propertyName: propertyKeyName,
          columnName: customName,
        },
      });
    }
  }

  public static setPrimaryAutoIncrementColumn(
    target: ObjectType,
    propertyKey: string | symbol,
    customName?: ColumnDecoratorProps['customName'],
  ): void {
    const propertyKeyName =
      Store.validateAndReturnStringPropertyKey(propertyKey);
    const entityData = Store.getExistedEntityDataOrCreate(target);

    entityData.autoIncrementColumn = propertyKeyName;
    Store.setPrimaryColumn(target, propertyKeyName, customName);
  }

  public static setRelation(
    target: ObjectType,
    propertyKey: string | symbol,
    relationsData: EntityRelation,
  ): void {
    const propertyKeyName =
      Store.validateAndReturnStringPropertyKey(propertyKey);
    const entityData = Store.getExistedEntityDataOrCreate(target);
    if (
      relationsData.relationType !== RelationType.ManyToMany &&
      (!relationsData.field || !relationsData.relatedEntityField)
    ) {
      throw new WrongEntityError(
        `Entity field ${propertyKeyName}: relation field and relatedEntityField can not be empty for oneToOne, oneToMany or ManyToOne relation`,
      );
    }

    if (
      relationsData.relationType === RelationType.ManyToMany &&
      !relationsData.intermediateTable
    ) {
      throw new WrongEntityError(
        `Entity field ${propertyKeyName}: intermediateTableName field can not be empty for ManyToMany relation`,
      );
    }

    entityData.relations[propertyKeyName] = relationsData;
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

  private static validateAndReturnStringPropertyKey(
    propertyKey: string | symbol,
  ): string {
    if (typeof propertyKey !== 'string' || !propertyKey) {
      throw new WrongEntityError(
        `Entity propertyKey should be string and not can not empty`,
      );
    }

    return propertyKey;
  }

  private static getExistedEntityDataOrCreate(target: ObjectType): EntityData {
    if (!Store.getEntityDataByFunction(target.constructor)) {
      this.entityDataStore.set(target.constructor, new EntityData());
    }

    return this.entityDataStore.get(target.constructor);
  }
}

export default Store;
