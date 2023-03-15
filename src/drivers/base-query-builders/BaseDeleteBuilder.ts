import { DeleteProps } from '../types/delete';
import SelectBuilder from '../types/builders/SelectBuilder';
import WrongDeleteQuery from '../../error/WrongDeleteQuery';
import { fromStatement } from '../consts/sqlStatements';
import DeleteBuilder from '../types/builders/DeleteBuilder';

class BaseDeleteBuilder implements DeleteBuilder {
  readonly selectBuilder: SelectBuilder;
  public deleteStatement = 'DELETE';
  public fromStatement = fromStatement;
  constructor(selectBuilder: SelectBuilder) {
    this.selectBuilder = selectBuilder;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterDeleteSql(props: DeleteProps<string>): string {
    return '';
  }

  validateProps(props: DeleteProps<string>): void {
    if (!props.tableName) {
      throw new WrongDeleteQuery(
        'Table name can not be empty for delete statement',
      );
    }
  }
  getDeleteSql(props: DeleteProps<string>): string {
    this.validateProps(props);

    return `${this.deleteStatement} ${this.fromStatement} ${
      props.tableName
    } ${this.selectBuilder.getWhereSql(props.where)} ${this.afterDeleteSql(
      props,
    )}`;
  }
}

export default BaseDeleteBuilder;
