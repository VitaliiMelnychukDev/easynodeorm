import {
  AddColumnProps,
  ChangeColumnType,
  ColumnProps,
  DefaultValueTypes,
} from '../createTable';

interface TableBuilder<AllowedTypes> {
  getCreateTableSql(
    tableName: string,
    columns: ColumnProps<AllowedTypes>[],
  ): string;
  getDropTableSql(tableName: string): string;
  getAddColumnSql(
    tableName: string,
    column: AddColumnProps<AllowedTypes>,
  ): string;
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
    column: ChangeColumnType<AllowedTypes>,
  ): string;
}

export default TableBuilder;
