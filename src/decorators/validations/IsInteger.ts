import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';
import { MessageCode } from '../../consts/message';
import {
  BaseDecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/decorators/validation';

const IsIntegerValidator = ({
  value,
  propertyKey,
}: BaseDecoratorDataMethodParams): ValidationDecoratorsMethodReturnType => {
  if (typeof value !== 'number') {
    return MessageCode.NotValidPropertyType;
  }

  if (!Number.isInteger(value)) {
    return `${propertyKey} should be integer`;
  }

  return null;
};
const IsInteger =
  (): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'isInteger',
      decoratorProps: {
        method: IsIntegerValidator,
      },
    });
  };

export default IsInteger;
