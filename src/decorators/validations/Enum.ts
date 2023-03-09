import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';
import { MessageCode } from '../../consts/message';
import { AllowedValues, EnumProps } from '../../types/decorators/enum';
import {
  DecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/decorators/validation';
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
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPropertyValidation({
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
