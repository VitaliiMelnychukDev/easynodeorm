export type DecoratorPropertyKey = string | symbol;

export enum ValidationDecorator {
  Enum = 'enumDecorator',
  Length = 'lengthDecorator',
  IsInteger = 'isInteger',
  IsUnsigned = 'isUnsigned',
}
