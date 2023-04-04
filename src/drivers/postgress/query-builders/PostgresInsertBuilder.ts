import BaseInsertBuilder from '../../query-builders/BaseInsertBuilder';
import { InsertOptions, RowsToInsert } from '../../types/insert';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresInsertBuilder extends BaseInsertBuilder {
  afterInsertSql(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tableName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rows: RowsToInsert,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: InsertOptions,
  ): string {
    return returningAllAfterAction;
  }
}

export default PostgresInsertBuilder;
