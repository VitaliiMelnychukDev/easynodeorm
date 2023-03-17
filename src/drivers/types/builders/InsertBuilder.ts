import { RowsToInsert } from '../insert';

interface InsertBuilder {
  getInsertSql(tableName: string, rows: RowsToInsert): string;
}

export default InsertBuilder;
