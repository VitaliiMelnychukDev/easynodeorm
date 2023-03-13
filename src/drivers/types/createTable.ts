export type DefaultValueTypes = string | boolean | number | null;

export type AllowedAutoGenerationStrategy = 'increment';

export type ColumnProps<AllowedTypes> = {
  name: string;
  default?: DefaultValueTypes;
  type: AllowedTypes;
  isPrimary?: boolean;
  autoGenerationStrategy?: AllowedAutoGenerationStrategy;
  isUnique?: boolean;
  length?: number;
  enum?: string[];
  enumTypeName?: string;
  isUnsigned?: boolean;
};

export type AddColumnProps<AllowedTypes> = Pick<
  ColumnProps<AllowedTypes>,
  | 'name'
  | 'default'
  | 'type'
  | 'isUnsigned'
  | 'isUnique'
  | 'length'
  | 'enum'
  | 'enumTypeName'
>;

export type ChangeColumnType<AllowedTypes> = {
  name: string;
  newType: AllowedTypes;
  length?: number;
  usingPart?: string;
};
