import BaseInsertBuilder from '../../base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from '../../types/insert';

class PostgresInsertBuilder extends BaseInsertBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsertSql(rows: InsertBuilderRows): string {
    return ' RETURNING *';
  }
}

export default PostgresInsertBuilder;
