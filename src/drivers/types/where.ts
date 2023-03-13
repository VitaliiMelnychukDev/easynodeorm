import { isSelect, Select } from './select';

export type DefaultTypes = string | boolean | number | null;

export type DefaultTypeOrSubQuery = DefaultTypes | Select;

export type BetweenValue = number | Select;

export type Between = {
  lower: BetweenValue;
  upper: BetweenValue;
};

export type InConditionValue = string[] | number[] | Select;

export type ConditionValues = {
  equal: DefaultTypeOrSubQuery;
  notEqual: DefaultTypeOrSubQuery;
  is: DefaultTypeOrSubQuery;
  greaterThan: DefaultTypeOrSubQuery;
  greaterThanEqual: DefaultTypeOrSubQuery;
  lowerThan: DefaultTypeOrSubQuery;
  lowerThanEqual: DefaultTypeOrSubQuery;
  between: Between;
  like: string;
  in: InConditionValue;
};

export type SupportedConditionOperators = keyof ConditionValues;

export enum LogicalOperator {
  Not = 'not',
  Or = 'or',
  And = 'and',
}

export type Condition = {
  [P in SupportedConditionOperators]?: ConditionValues[P];
};

export type ColumnCondition = {
  [key in string]: Condition | DefaultTypes;
};

export type LogicalWhere = {
  logicalOperator: LogicalOperator;

  conditions: Where[];
};

export type Where = ColumnCondition | LogicalWhere;

export const isBetween = (
  conditionValues: ConditionValues[SupportedConditionOperators],
): conditionValues is Between => {
  return (
    (<Between>conditionValues).lower !== undefined &&
    (<Between>conditionValues).upper !== undefined
  );
};

export const isInConditionValue = (
  conditionValues: ConditionValues[SupportedConditionOperators],
): conditionValues is Between => {
  return Array.isArray(conditionValues) || isSelect(conditionValues);
};

export const isDefaultType = (value: unknown): value is DefaultTypes => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (typeof value === 'object' && value === null)
  );
};

export const isDefaultTypeOrSubQuery = (
  conditionValues: ConditionValues[SupportedConditionOperators],
): conditionValues is DefaultTypeOrSubQuery => {
  return (
    isDefaultType(conditionValues) ||
    (typeof conditionValues === 'object' && isSelect(conditionValues))
  );
};

export const isLogicalWhere = (
  whereCondition: Where,
): whereCondition is LogicalWhere => {
  return (<LogicalWhere>whereCondition).logicalOperator !== undefined;
};
