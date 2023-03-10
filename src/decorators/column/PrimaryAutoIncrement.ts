import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';

const PrimaryAutoIncrement =
  (customName?: ColumnDecoratorProps['customName']): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPrimaryAutoIncrementColumn(
      target,
      propertyKey,
      customName,
    );
  };

export default PrimaryAutoIncrement;
