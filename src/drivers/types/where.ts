import { isSelect, Select } from './select';
import { PropertyKeyTypes } from '../../types/object';

export type DefaultType = string | boolean | number | null;

export type DefaultTypeOrSubQuery = DefaultType | Select<string>;

export type BetweenValue = number | Select<string>;

export type Between = {
  lower: BetweenValue;
  upper: BetweenValue;
};

export type InConditionValue = string[] | number[] | Select<string>;

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

export type ColumnsCondition<ColumnNames extends PropertyKeyTypes> = {
  [key in ColumnNames]?: Condition | DefaultType;
};

export type LogicalWhere<ColumnNames extends PropertyKeyTypes> = {
  logicalOperator: LogicalOperator;

  conditions: Where<ColumnNames>[];
};

export type Where<ColumnNames extends PropertyKeyTypes> =
  | ColumnsCondition<ColumnNames>
  | LogicalWhere<ColumnNames>;

export const isBetween = (
  conditionValues: ConditionValues[SupportedConditionOperators],
): conditionValues is Between => {
  return (
    (<Between>conditionValues).lower !== undefined &&
    (<Between>conditionValues).upper !== undefined
  );
};

export const isDefaultType = (value: unknown): value is DefaultType => {
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
  whereCondition: Where<string>,
): whereCondition is LogicalWhere<string> => {
  return (<LogicalWhere<string>>whereCondition).logicalOperator !== undefined;
};
