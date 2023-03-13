import { ColumnProps } from '../createTable';

interface TableBuilder<T> {
  getCreateTableSql(tableName: string, columns: ColumnProps<T>[]): string;
  getDropTableSql(tableName: string): string;
}

export default TableBuilder;
