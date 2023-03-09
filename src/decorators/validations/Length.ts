import { PropertyDecoratorTarget } from '../../types/decorators/decorator';
import EntityDataSetter from '../../helpers/entity/EntityDataSetter';
import LengthProps from '../../types/decorators/length';
import { MessageCode } from '../../consts/message';
import {
  DecoratorDataMethodParams,
  ValidationDecoratorsMethodReturnType,
} from '../../types/decorators/validation';
const LengthValidator = ({
  value,
  propertyKey,
  props,
}: DecoratorDataMethodParams<LengthProps>): ValidationDecoratorsMethodReturnType => {
  if (typeof value !== 'string') {
    return MessageCode.NotValidPropertyType;
  }

  if (value.length < props.min) {
    return `${propertyKey} length should be more or equals ${props.min}`;
  }

  if (props.max && value.length > props.max) {
    return `${propertyKey} length should be less or equals ${props.max}`;
  }

  return null;
};

const Length =
  (min: number, max?: number): PropertyDecorator =>
  (target: PropertyDecoratorTarget, propertyKey: string | symbol): void => {
    EntityDataSetter.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: 'lengthDecorator',
      decoratorProps: {
        props: { min, ...(max && { max }) },
        method: LengthValidator,
      },
    });
  };

export default Length;
