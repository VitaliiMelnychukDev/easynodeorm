export type TextTypes = 'char' | 'varchar' | 'text';
export type BooleanTypes = 'boolean';
export type NumericTypes = 'smallint' | 'int' | 'float' | 'double';
export type DateTypes = 'timestamp';
export type OtherTypes = 'enum';

export type AllowedMySqlTypes =
  | TextTypes
  | BooleanTypes
  | NumericTypes
  | DateTypes
  | OtherTypes;
