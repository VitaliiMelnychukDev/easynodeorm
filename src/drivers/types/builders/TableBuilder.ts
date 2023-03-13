import {
  AddColumnProps,
  ChangeColumnType,
  ColumnProps,
  DefaultValueTypes,
} from '../createTable';

interface TableBuilder<T> {
  getCreateTableSql(tableName: string, columns: ColumnProps<T>[]): string;
  getDropTableSql(tableName: string): string;
  getAddColumnSql(tableName: string, column: AddColumnProps<T>): string;
  getDropColumnSql(tableName: string, columnName: string): string;
  getRenameColumnSql(
    tableName: string,
    oldColumnName: string,
    newColumnName: string,
  ): string;
  getDropColumnDefaultValueSql(tableName: string, columnName: string): string;
  getSetColumnDefaultValueSql(
    tableName: string,
    columnName: string,
    defaultValue: DefaultValueTypes,
  ): string;
  getChangeColumnTypeSql(
    tableName: string,
    column: ChangeColumnType<T>,
  ): string;
}

export default TableBuilder;
