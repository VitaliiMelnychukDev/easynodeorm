import { InsertBuilderRows } from '../insert';

interface InsertBuilder {
  getInsertSql(tableName: string, rows: InsertBuilderRows): string;
}

export default InsertBuilder;
