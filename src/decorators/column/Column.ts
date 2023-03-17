import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const Column =
  (columnProps: ColumnDecoratorProps = {}): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setColumnProperties(target, propertyKey, columnProps);
  };

export default Column;
