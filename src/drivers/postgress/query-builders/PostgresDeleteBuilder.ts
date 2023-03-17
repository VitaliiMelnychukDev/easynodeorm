import BaseDeleteBuilder from '../../query-builders/BaseDeleteBuilder';
import { DeleteProps } from '../../types/delete';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresDeleteBuilder extends BaseDeleteBuilder {
  afterDeleteSql(props: DeleteProps<string>): string {
    return props.returnDeletedRows ? returningAllAfterAction : '';
  }
}

export default PostgresDeleteBuilder;
