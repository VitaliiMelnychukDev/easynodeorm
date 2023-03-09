import { MessageCode } from '../../consts/message';
import {
  BaseDecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/entity-data/validation';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

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
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'isInteger',
      decoratorProps: {
        method: IsIntegerValidator,
      },
    });
  };

export default IsInteger;
