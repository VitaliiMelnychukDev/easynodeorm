import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';
import { MessageCode } from '../../consts/message';
import {
  BaseDecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/decorators/validation';

const IsUnsignedValidator = ({
  value,
  propertyKey,
}: BaseDecoratorDataMethodParams): ValidationDecoratorsMethodReturnType => {
  if (typeof value !== 'number') {
    return MessageCode.NotValidPropertyType;
  }

  if (value < 0) {
    return `${propertyKey} should be positive`;
  }

  return null;
};
const IsUnsigned =
  (): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'isUnsigned',
      decoratorProps: {
        method: IsUnsignedValidator,
      },
    });
  };

export default IsUnsigned;
