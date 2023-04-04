import { InsertOptions, RowsToInsert } from '../types/insert';
import WrongInsertQuery from '../../error/WrongInsertQuery';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import { AllowedPropertiesTypes } from '../../types/global';
import InsertBuilder from '../types/builders/InsertBuilder';

class BaseInsertBuilder implements InsertBuilder {
  getColumns(rows: RowsToInsert): string {
    const columns: string[] = rows[0].map((property) => property.name);

    return `(${columns.join(',')})`;
  }

  getRowValues(values: AllowedPropertiesTypes[]): string {
    return values
      .map((value) => QueryBuilderHelper.prepareValue(value))
      .join(',');
  }

  getRows(rowValues: string[]): string {
    return rowValues.map((rowValue) => `(${rowValue})`).join(',');
  }

  getRowsSqlWithValues(rows: RowsToInsert): string {
    const rowQueries = rows.map((row) => {
      const rowValues = row.map((rowValue) => rowValue.value);

      return this.getRowValues(rowValues);
    });
    return `VALUES ${this.getRows(rowQueries)}`;
  }

  checkProperties(tableName: string, rows: RowsToInsert): void {
    if (!tableName) {
      throw new WrongInsertQuery(
        'Table name can not be empty for insert query',
      );
    }

    if (rows.length === 0) {
      throw new WrongInsertQuery(
        'Insert query should have at least one row to insert',
      );
    }

    rows.forEach((row) => {
      row.forEach((rowValue) => {
        if (!rowValue.name) {
          throw new WrongInsertQuery(
            'insert query column names can not be empty.',
          );
        }
      });
    });
  }

  afterInsertSql(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tableName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rows: RowsToInsert,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: InsertOptions,
  ): string {
    return '';
  }

  getInsertSql(
    tableName: string,
    rows: RowsToInsert,
    options: InsertOptions,
  ): string {
    this.checkProperties(tableName, rows);

    return `INSERT INTO ${tableName} ${this.getColumns(
      rows,
    )} ${this.getRowsSqlWithValues(rows)} ${this.afterInsertSql(
      tableName,
      rows,
      options,
    )}`;
  }
}

export default BaseInsertBuilder;
