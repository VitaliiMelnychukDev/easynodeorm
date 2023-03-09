import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';

const PrimaryKey =
  (): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPrimaryColumn(target, propertyKey);
  };

export default PrimaryKey;
