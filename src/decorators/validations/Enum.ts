import { MessageCode } from '../../consts/message';
import {
  AllowedEnumValues,
  EnumProps,
} from '../../types/entity-data/decorators/enum';
import {
  DecoratorDataMethodProps,
  ValidationDecoratorsMethodReturnType,
} from '../../types/entity-data/validation';
import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';
import {
  DecoratorPropertyKey,
  ValidationDecorator,
} from '../../types/entity-data/decorator';

const EnumValidator = ({
  value,
  propertyKey,
  props,
}: DecoratorDataMethodProps<EnumProps>): ValidationDecoratorsMethodReturnType => {
  if (typeof value !== 'string') {
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
  (allowedValues: AllowedEnumValues): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: ValidationDecorator.Enum,
      decoratorProps: {
        props: { allowedValues },
        method: EnumValidator,
      },
    });
  };

export default Enum;
