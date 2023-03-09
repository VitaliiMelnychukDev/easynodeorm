export type ColumnDecoratorProps = {
  customName?: string;
  defaultValue?: string | number | boolean;
};

type ColumnName = {
  propertyName: string;
  columnName: string;
};

export type ColumnData = {
  customName?: ColumnName;
  defaultValue?: ColumnDecoratorProps['defaultValue'];
};

export type ColumnsData = Map<string, ColumnData>;
