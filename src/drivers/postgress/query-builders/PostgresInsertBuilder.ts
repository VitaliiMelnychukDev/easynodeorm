import BaseInsertBuilder from '../../base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from '../../types/insert';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresInsertBuilder extends BaseInsertBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsertSql(rows: InsertBuilderRows): string {
    return returningAllAfterAction;
  }
}

export default PostgresInsertBuilder;
