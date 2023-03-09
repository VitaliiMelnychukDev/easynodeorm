import { EntityData } from './entity';
import { SupportedDecorators, SupportedDecoratorsKeys } from './validation';

export type PropertyDecoratorTarget = {
  entityData?: EntityData;
};

export type SetPropertyValidationProps = {
  target: PropertyDecoratorTarget;
  propertyKey: string | symbol;
  decoratorKey: SupportedDecoratorsKeys;
  decoratorProps: SupportedDecorators[SupportedDecoratorsKeys];
};
