import BaseUpdateBuilder from '../../base-query-builders/BaseUpdateBuilder';
import { UpdateProps } from '../../types/update';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresUpdateBuilder extends BaseUpdateBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterUpdateSql(props: UpdateProps): string {
    return returningAllAfterAction;
  }
}

export default PostgresUpdateBuilder;
