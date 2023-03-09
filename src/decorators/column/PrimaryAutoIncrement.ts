import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';

const PrimaryAutoIncrement =
  (): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPrimaryAutoIncrementColumn(target, propertyKey);
  };

export default PrimaryAutoIncrement;
