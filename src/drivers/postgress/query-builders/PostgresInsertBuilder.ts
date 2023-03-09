import BaseInsertBuilder from '../../base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from '../../types/insertBuilder';

class PostgresInsertBuilder extends BaseInsertBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertAfterQuery(rows: InsertBuilderRows): string {
    return ' RETURNING *';
  }
}

export default PostgresInsertBuilder;
