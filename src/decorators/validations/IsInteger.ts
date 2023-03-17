import { MessageCode } from '../../consts/message';
import {
  BaseDecoratorMethodProps,
  ValidationDecoratorsMethodReturnType,
} from '../../types/entity-data/validation';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import {
  DecoratorPropertyKey,
  ValidationDecorator,
} from '../../types/entity-data/decorator';

const IsIntegerValidator = ({
  value,
  propertyKey,
}: BaseDecoratorMethodProps): ValidationDecoratorsMethodReturnType => {
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
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: ValidationDecorator.IsInteger,
      decoratorProps: {
        method: IsIntegerValidator,
      },
    });
  };

export default IsInteger;
