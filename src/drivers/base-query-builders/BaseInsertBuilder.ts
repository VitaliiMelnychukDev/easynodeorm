import { InsertBuilderRows } from '../types/insertBuilder';
import WrongInsertQuery from '../../error/WrongInsertQuery';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import { AllowedTypes } from '../../types/global';

class BaseInsertBuilder {
  public queryStatement = 'INSERT INTO';

  public valueStatement = 'VALUES';

  getTableName(tableName: string): string {
    return tableName;
  }

  getColumnsQuery(rows: InsertBuilderRows): string {
    const columns: string[] = rows[0].map((property) => property.name);

    return `(${columns.join(',')})`;
  }

  getRowValuesQuery(values: AllowedTypes[]): string {
    return values
      .map((value) => QueryBuilderHelper.prepareValue(value))
      .join(',');
  }

  getRowsQuery(rowValues: string[]): string {
    return rowValues.map((rowValue) => `(${rowValue})`).join(',');
  }

  getRowsQueryWithValues(rows: InsertBuilderRows): string {
    const rowQueries = rows.map((row) => {
      const rowValues = row.map((rowValue) => rowValue.value);

      return this.getRowValuesQuery(rowValues);
    });
    return `${this.valueStatement} ${this.getRowsQuery(rowQueries)}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertAfterQuery(rows: InsertBuilderRows): string {
    return '';
  }

  buildQuery(tableName: string, rows: InsertBuilderRows): string {
    return `${this.queryStatement} ${this.getTableName(
      tableName,
    )} ${this.getColumnsQuery(rows)} ${this.getRowsQueryWithValues(
      rows,
    )}${this.insertAfterQuery(rows)}`;
  }

  checkProperties(rows: InsertBuilderRows): void {
    if (rows.length === 0) {
      throw new WrongInsertQuery(
        'Insert query should have at least one row to insert',
      );
    }
  }

  getQuery(tableName: string, rows: InsertBuilderRows): string {
    this.checkProperties(rows);

    return this.buildQuery(tableName, rows);
  }
}

export default BaseInsertBuilder;
