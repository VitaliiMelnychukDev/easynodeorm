import { InsertBuilderRows } from '../types/insert';
import WrongInsertQuery from '../../error/WrongInsertQuery';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import { AllowedTypes } from '../../types/global';
import InsertBuilder from '../types/builders/InsertBuilder';

class BaseInsertBuilder implements InsertBuilder {
  public queryStatement = 'INSERT INTO';

  public valueStatement = 'VALUES';

  getTableName(tableName: string): string {
    return tableName;
  }

  getColumns(rows: InsertBuilderRows): string {
    const columns: string[] = rows[0].map((property) => property.name);

    return `(${columns.join(',')})`;
  }

  getRowValues(values: AllowedTypes[]): string {
    return values
      .map((value) => QueryBuilderHelper.prepareValue(value))
      .join(',');
  }

  getRows(rowValues: string[]): string {
    return rowValues.map((rowValue) => `(${rowValue})`).join(',');
  }

  getRowsSqlWithValues(rows: InsertBuilderRows): string {
    const rowQueries = rows.map((row) => {
      const rowValues = row.map((rowValue) => rowValue.value);

      return this.getRowValues(rowValues);
    });
    return `${this.valueStatement} ${this.getRows(rowQueries)}`;
  }

  checkProperties(rows: InsertBuilderRows): void {
    if (rows.length === 0) {
      throw new WrongInsertQuery(
        'Insert query should have at least one row to insert',
      );
    }

    rows.forEach((row) => {
      row.map((rowValue) => {
        if (!rowValue.name) {
          throw new WrongInsertQuery(
            'insert query column names can not be empty.',
          );
        }
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsertSql(rows: InsertBuilderRows): string {
    return '';
  }

  getInsertSql(tableName: string, rows: InsertBuilderRows): string {
    this.checkProperties(rows);

    return `${this.queryStatement} ${this.getTableName(
      tableName,
    )} ${this.getColumns(rows)} ${this.getRowsSqlWithValues(
      rows,
    )} ${this.afterInsertSql(rows)}`;
  }
}

export default BaseInsertBuilder;
