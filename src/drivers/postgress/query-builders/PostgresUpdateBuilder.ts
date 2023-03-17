import BaseUpdateBuilder from '../../query-builders/BaseUpdateBuilder';
import { UpdateProps } from '../../types/update';
import { returningAllAfterAction } from '../constants/sqlStatements';

class PostgresUpdateBuilder extends BaseUpdateBuilder {
  afterUpdateSql(props: UpdateProps<string>): string {
    return props.returnUpdatedRows ? returningAllAfterAction : '';
  }
}

export default PostgresUpdateBuilder;
