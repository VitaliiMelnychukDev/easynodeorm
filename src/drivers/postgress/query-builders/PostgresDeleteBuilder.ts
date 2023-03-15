import BaseDeleteBuilder from '../../base-query-builders/BaseDeleteBuilder';
import { DeleteProps } from '../../types/delete';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresDeleteBuilder extends BaseDeleteBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterDeleteSql(props: DeleteProps<string>): string {
    return props.returnDeletedRows ? returningAllAfterAction : '';
  }
}

export default PostgresDeleteBuilder;
