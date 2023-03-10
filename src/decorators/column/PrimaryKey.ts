import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';

const PrimaryKey =
  (customName?: ColumnDecoratorProps['customName']): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPrimaryColumn(target, propertyKey, customName);
  };

export default PrimaryKey;
