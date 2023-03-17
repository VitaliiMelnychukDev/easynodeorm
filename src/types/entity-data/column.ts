import { ColumnDecoratorProps } from './decorators/column';

type ColumnName = {
  entityPropertyName: string;
  columnName: string;
};

export type ColumnData = {
  customName?: ColumnName;
  defaultValue?: ColumnDecoratorProps['defaultValue'];
};

export type ColumnsData = Map<string, ColumnData>;
