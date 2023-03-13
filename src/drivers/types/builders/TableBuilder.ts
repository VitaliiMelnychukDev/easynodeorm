import { ColumnProps } from '../createTable';

interface TableBuilder<T> {
  getCreateTableSql(tableName: string, columns: ColumnProps<T>[]): string;
}

export default TableBuilder;
