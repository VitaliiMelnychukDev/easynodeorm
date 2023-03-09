import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

const Column =
  (columnProps: ColumnDecoratorProps = {}): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setColumnProperties(target, propertyKey, columnProps);
  };

export default Column;
