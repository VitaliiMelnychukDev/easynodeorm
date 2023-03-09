import { MessageCode } from '../../consts/message';
import {
  AllowedValues,
  EnumProps,
} from '../../types/entity-data/decorators/enum';
import {
  DecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/entity-data/validation';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

const EnumValidator = ({
  value,
  propertyKey,
  props,
}: DecoratorDataMethodParams<EnumProps>): ValidationDecoratorsMethodReturnType => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return MessageCode.NotValidPropertyType;
  }

  if (!props.allowedValues.includes(value)) {
    return `${propertyKey} should be one of the next props ${props.allowedValues.join(
      ', ',
    )}.`;
  }

  return null;
};

const Enum =
  (allowedValues: AllowedValues): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'enumDecorator',
      decoratorProps: {
        props: { allowedValues },
        method: EnumValidator,
      },
    });
  };

export default Enum;
