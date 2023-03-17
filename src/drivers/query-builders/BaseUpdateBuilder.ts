import SelectBuilder from '../types/builders/SelectBuilder';
import { UpdateProps } from '../types/update';
import WrongUpdateQuery from '../../error/WrongUpdateQuery';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import { PreparedColumnsData } from '../../types/entity-data/entity';
import UpdateBuilder from '../types/builders/UpdateBuilder';

class BaseUpdateBuilder implements UpdateBuilder {
  readonly selectBuilder: SelectBuilder;

  constructor(selectBuilder: SelectBuilder) {
    this.selectBuilder = selectBuilder;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterUpdateSql(props: UpdateProps<string>): string {
    return '';
  }

  getUpdatedColumnSql(columnData: PreparedColumnsData): string {
    return `${columnData.name} = ${QueryBuilderHelper.prepareValue(
      columnData.value,
    )}`;
  }

  getUpdatedColumnsSql(columnsData: PreparedColumnsData[]): string {
    return columnsData
      .map((columnData) => this.getUpdatedColumnSql(columnData))
      .join(',');
  }

  validateProps(props: UpdateProps<string>): void {
    if (!props.tableName) {
      throw new WrongUpdateQuery(
        'Table name can not be empty for update query',
      );
    }

    if (props.columns.length === 0) {
      throw new WrongUpdateQuery(
        'Update query should have at least one row to update',
      );
    }

    props.columns.forEach((column) => {
      if (!column.name) {
        throw new WrongUpdateQuery(
          'Update query column names can not be empty.',
        );
      }
    });
  }
  getUpdateSql(props: UpdateProps<string>): string {
    this.validateProps(props);

    return `UPDATE ${props.tableName} SET ${this.getUpdatedColumnsSql(
      props.columns,
    )} ${this.selectBuilder.getWhereSql(props.where)} ${this.afterUpdateSql(
      props,
    )}`;
  }
}

export default BaseUpdateBuilder;
