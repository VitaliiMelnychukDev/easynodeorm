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
