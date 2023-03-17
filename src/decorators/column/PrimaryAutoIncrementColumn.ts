import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import { ColumnDecoratorProps } from '../../types/entity-data/decorators/column';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const PrimaryAutoIncrementColumn =
  (customName?: ColumnDecoratorProps['customName']): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setPrimaryAutoIncrementColumn(
      target,
      propertyKey,
      customName,
    );
  };

export default PrimaryAutoIncrementColumn;
