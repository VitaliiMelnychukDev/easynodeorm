import { LengthProps } from './decorators/length';
import { MessageCode } from '../../consts/message';
import { EnumProps } from './decorators/enum';
import { ValidationDecorator } from './decorator';

export type ValidationDecoratorsMethodReturnType = string | null | MessageCode;

export type BaseDecoratorMethodProps = {
  value: unknown;
  propertyKey: string;
};

export type DecoratorDataMethodProps<DecoratorProps> =
  BaseDecoratorMethodProps & {
    props: DecoratorProps;
  };

type DecoratorData<DecoratorProps> = {
  props: DecoratorProps;
  method: (
    params: DecoratorDataMethodProps<DecoratorProps>,
  ) => ValidationDecoratorsMethodReturnType;
};

type NoParamsDecoratorData = {
  method: (
    params: BaseDecoratorMethodProps,
  ) => ValidationDecoratorsMethodReturnType;
};

export type SupportedDecorators = {
  [ValidationDecorator.Length]: DecoratorData<LengthProps>;
  [ValidationDecorator.Enum]: DecoratorData<EnumProps>;
  [ValidationDecorator.IsInteger]: NoParamsDecoratorData;
  [ValidationDecorator.IsUnsigned]: NoParamsDecoratorData;
};

export type SupportedDecoratorsKeys = keyof SupportedDecorators;

export type PropertyValidations = {
  [Property in keyof SupportedDecorators]?: SupportedDecorators[Property];
};

export type EntityValidations = Map<string, PropertyValidations>;

export const isDecoratorData = <DecoratorProps>(
  decoratorValue: NoParamsDecoratorData | DecoratorData<DecoratorProps>,
): decoratorValue is DecoratorData<DecoratorProps> => {
  return (<DecoratorData<DecoratorProps>>decoratorValue).props !== undefined;
};

export enum QueryOperation {
  Update = 'Update',
  Insert = 'Insert',
}
