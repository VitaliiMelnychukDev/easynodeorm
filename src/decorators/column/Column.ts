import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';
import { ColumnDecoratorProps } from '../../types/decorators/column';

const Column =
  (columnProps: ColumnDecoratorProps = {}): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setColumnProperties(target, propertyKey, columnProps);
  };

export default Column;
