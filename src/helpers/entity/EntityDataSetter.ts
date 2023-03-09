import {
  SetPropertyValidationProps,
  PropertyDecoratorTarget,
} from '../../types/decorators/decorator';
import {
  ColumnData,
  ColumnDecoratorProps,
} from '../../types/decorators/column';
import { EntityData } from '../../types/decorators/entity';

class EntityDataSetter {
  static setPropertyValidation({
    target,
    propertyKey,
    decoratorKey,
    decoratorProps,
  }: SetPropertyValidationProps): void {
    if (typeof propertyKey !== 'string') return;
    EntityDataSetter.setEmptyEntityData(target);

    const propertyValidations = target.entityData.validations.has(propertyKey)
      ? target.entityData.validations.get(propertyKey)
      : {};
    target.entityData.validations.set(propertyKey, {
      ...propertyValidations,
      [decoratorKey]: decoratorProps,
    });
  }

  static setCustomTableName(
    target: PropertyDecoratorTarget,
    tableName: string,
  ): void {
    EntityDataSetter.setEmptyEntityData(target);

    target.entityData.tableName = tableName;
  }

  static setColumnProperties(
    target: PropertyDecoratorTarget,
    propertyKey: string | symbol,
    columnProperties: ColumnDecoratorProps,
  ): void {
    if (typeof propertyKey !== 'string') return;
    EntityDataSetter.setEmptyEntityData(target);

    target.entityData.columns.push(propertyKey);

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

    target.entityData.columnsData.set(propertyKey, columnsData);
  }

  static setPrimaryColumn(
    target: PropertyDecoratorTarget,
    propertyKey: string | symbol,
  ): void {
    if (typeof propertyKey !== 'string') return;
    EntityDataSetter.setEmptyEntityData(target);

    if (!target.entityData.primaryColumns.includes(propertyKey)) {
      target.entityData.primaryColumns.push(propertyKey);
    }
  }

  static setPrimaryAutoIncrementColumn(
    target: PropertyDecoratorTarget,
    propertyKey: string | symbol,
  ): void {
    if (typeof propertyKey !== 'string') return;
    EntityDataSetter.setEmptyEntityData(target);

    target.entityData.autoIncrementColumn = propertyKey;
    EntityDataSetter.setPrimaryColumn(target, propertyKey);
  }

  private static setEmptyEntityData(target: PropertyDecoratorTarget): void {
    if (!target.entityData || !(target.entityData instanceof EntityData)) {
      target.entityData = new EntityData();
    }
  }
}

export default EntityDataSetter;
