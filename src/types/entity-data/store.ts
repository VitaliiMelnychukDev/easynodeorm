import { SupportedDecorators, SupportedDecoratorsKeys } from './validation';
import { ObjectType } from '../object';

export type SetPropertyValidationProps = {
  target: ObjectType;
  propertyKey: string | symbol;
  decoratorKey: SupportedDecoratorsKeys;
  decoratorProps: SupportedDecorators[SupportedDecoratorsKeys];
};
