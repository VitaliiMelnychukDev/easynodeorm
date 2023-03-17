import { LengthProps } from '../../types/entity-data/decorators/length';
import { MessageCode } from '../../consts/message';
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

const LengthValidator = ({
  value,
  propertyKey,
  props,
}: DecoratorDataMethodProps<LengthProps>): ValidationDecoratorsMethodReturnType => {
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
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setPropertyValidation({
      target,
      propertyKey,
      decoratorKey: ValidationDecorator.Length,
      decoratorProps: {
        props: { min, ...(max && { max }) },
        method: LengthValidator,
      },
    });
  };

export default Length;
