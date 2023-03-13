import { BaseNameObject, RequiredAlias } from './base';

export type DistinctColumn = BaseNameObject & {
  distinct: boolean;
};

export type AggregationColumn = RequiredAlias & {
  aggregationMethod: string;
};

export type Column =
  | string
  | RequiredAlias
  | DistinctColumn
  | AggregationColumn;

export const isDistinctColumn = (column: Column): column is DistinctColumn => {
  return (<DistinctColumn>column).distinct !== undefined;
};

export const isAggregationColumn = (
  column: Column,
): column is AggregationColumn => {
  return (<AggregationColumn>column).aggregationMethod !== undefined;
};
