import BaseInsertBuilder from '../../query-builders/BaseInsertBuilder';
import { RowsToInsert } from '../../types/insert';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresInsertBuilder extends BaseInsertBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsertSql(rows: RowsToInsert): string {
    return returningAllAfterAction;
  }
}

export default PostgresInsertBuilder;
