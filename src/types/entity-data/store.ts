import { SupportedDecorators, SupportedDecoratorsKeys } from './validation';
import { ObjectType } from '../object';
import { DecoratorPropertyKey } from './decorator';

export type SetPropertyValidationProps = {
  target: ObjectType;
  propertyKey: DecoratorPropertyKey;
  decoratorKey: SupportedDecoratorsKeys;
  decoratorProps: SupportedDecorators[SupportedDecoratorsKeys];
};
