import { InsertOptions, RowsToInsert } from '../insert';

interface InsertBuilder {
  getInsertSql(
    tableName: string,
    rows: RowsToInsert,
    options: InsertOptions,
  ): string;
}

export default InsertBuilder;
