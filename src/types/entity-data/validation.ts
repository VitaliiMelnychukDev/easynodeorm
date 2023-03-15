import LengthProps from './decorators/length';
import { MessageCode } from '../../consts/message';
import { EnumProps } from './decorators/enum';

export type ValidationDecoratorsMethodReturnType = string | null | MessageCode;
export type BaseDecoratorDataMethodParams = {
  value: unknown;
  propertyKey: string;
};

export type DecoratorDataMethodParams<T> = BaseDecoratorDataMethodParams & {
  props: T;
};

type DecoratorData<T> = {
  props: T;
  method: (
    params: DecoratorDataMethodParams<T>,
  ) => ValidationDecoratorsMethodReturnType;
};

type NoParamsDecoratorData = {
  method: (
    params: BaseDecoratorDataMethodParams,
  ) => ValidationDecoratorsMethodReturnType;
};

export type SupportedDecorators = {
  lengthDecorator: DecoratorData<LengthProps>;
  enumDecorator: DecoratorData<EnumProps>;
  isInteger: NoParamsDecoratorData;
  isUnsigned: NoParamsDecoratorData;
};

export type SupportedDecoratorsKeys = keyof SupportedDecorators;

export type PropertyValidations = {
  [Property in keyof SupportedDecorators]?: SupportedDecorators[Property];
};

export type EntityValidations = Map<string, PropertyValidations>;

export const isDecoratorData = <T>(
  decoratorValue: NoParamsDecoratorData | DecoratorData<T>,
): decoratorValue is DecoratorData<T> => {
  return (<DecoratorData<T>>decoratorValue).props !== undefined;
};

export enum Operation {
  Update = 'Update',
  Insert = 'Insert',
}
