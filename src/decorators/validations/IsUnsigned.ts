import { MessageCode } from '../../consts/message';
import {
  BaseDecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/entity-data/validation';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

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
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'isUnsigned',
      decoratorProps: {
        method: IsUnsignedValidator,
      },
    });
  };

export default IsUnsigned;
