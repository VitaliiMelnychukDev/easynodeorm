import BaseDeleteBuilder from '../../base-query-builders/BaseDeleteBuilder';
import { DeleteProps } from '../../types/delete';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresDeleteBuilder extends BaseDeleteBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterDeleteSql(props: DeleteProps): string {
    return returningAllAfterAction;
  }
}

export default PostgresDeleteBuilder;
