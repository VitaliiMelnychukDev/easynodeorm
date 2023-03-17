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

const IsUnsignedValidator = ({
  value,
  propertyKey,
}: BaseDecoratorMethodProps): ValidationDecoratorsMethodReturnType => {
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
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: ValidationDecorator.IsUnsigned,
      decoratorProps: {
        method: IsUnsignedValidator,
      },
    });
  };

export default IsUnsigned;
