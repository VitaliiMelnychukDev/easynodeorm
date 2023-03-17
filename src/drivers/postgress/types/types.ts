export type TextTypes = 'char' | 'varchar' | 'text';
export type BooleanTypes = 'boolean';
export type NumericTypes = 'smallint' | 'int' | 'serial' | 'float' | 'real';
export type DateTypes = 'timestamp';
export type OtherTypes = 'enum';

export type AllowedPostgresTypes =
  | TextTypes
  | BooleanTypes
  | NumericTypes
  | DateTypes
  | OtherTypes;
