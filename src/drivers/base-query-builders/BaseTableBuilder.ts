import { ColumnProps } from '../types/createTable';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import WrongCreateQuery from '../../error/WrongCreateQuery';
import TableBuilder from '../types/builders/TableBuilder';

class BaseTableBuilder<AllowedTypes> implements TableBuilder<AllowedTypes> {
  private beforeSqlQueries: string[] = [];

  public dbEnumType = 'ENUM';

  public defaultStatement = 'DEFAULT';

  public notNullStatement = 'NOT NULL';

  public autoIncrementStatement = 'AUTO_INCREMENT';

  public unsignedStatement = 'UNSIGNED';

  public createTableStatement = 'CREATE TABLE IF NOT EXISTS';

  public dropTableStatement = 'DROP TABLE IF EXISTS';

  public primaryKeyStatement = 'PRIMARY KEY';

  public uniqueStatement = 'UNIQUE';

  public addBeforeSql(query: string): void {
    this.beforeSqlQueries.push(query);
  }

  public getColumnLengthPart(length?: number): string {
    return length ? `(${length})` : '';
  }

  public getColumnTypePart(
    type: AllowedTypes | string,
    length?: number,
  ): string {
    return `${type}${this.getColumnLengthPart(length)}`;
  }

  public getColumnDefaultPart(column: ColumnProps<AllowedTypes>): string {
    if (column.autoGenerationStrategy) return '';

    return column.default !== undefined
      ? `${this.defaultStatement} ${
          column.default !== null
            ? QueryBuilderHelper.prepareValue(column.default)
            : null
        }`
      : this.notNullStatement;
  }

  public getUnsignedPart(
    isUnsigned?: ColumnProps<AllowedTypes>['isUnsigned'],
  ): string {
    return isUnsigned ? this.unsignedStatement : '';
  }

  public getEnumColumn(column: ColumnProps<AllowedTypes>): string {
    if (column.type !== 'enum') {
      return '';
    }

    if (!column.enum?.length) {
      throw new WrongCreateQuery('enum properties for enum type column.');
    }

    return `${column.name} ${this.getColumnTypePart(
      this.dbEnumType,
      column.length,
    )} ${QueryBuilderHelper.getEnumValuesQuery(column.enum)})`;
  }

  public getSimpleColumn(column: ColumnProps<AllowedTypes>): string {
    return `${column.name} ${this.getColumnTypePart(
      column.type,
      column.length,
    )} ${this.getUnsignedPart(column.isUnsigned)} ${this.getColumnDefaultPart(
      column,
    )}`;
  }

  public getAutoIncrementedColumn(column: ColumnProps<AllowedTypes>): string {
    return `${this.getSimpleColumn(column)} ${this.autoIncrementStatement}`;
  }

  public getColumn(column: ColumnProps<AllowedTypes>): string {
    if (column.type === 'enum') {
      return this.getEnumColumn(column);
    }

    if (column.autoGenerationStrategy) {
      return this.getAutoIncrementedColumn(column);
    }

    return this.getSimpleColumn(column);
  }
  public getColumns(columns: ColumnProps<AllowedTypes>[]): string[] {
    return columns.map((column) => this.getColumn(column));
  }

  public getPrimaryKeyConstraint(columns: ColumnProps<AllowedTypes>[]): string {
    const primaryKeys: string[] = [];
    columns.forEach((column) => {
      if (column.isPrimary) {
        primaryKeys.push(column.name);
      }
    });

    return primaryKeys.length
      ? `${this.primaryKeyStatement} (${primaryKeys.join(',')})`
      : '';
  }

  public getUniqueColumnConstraint(columnName: string): string {
    return `${this.uniqueStatement}(${columnName})`;
  }

  public getConstraints(columns: ColumnProps<AllowedTypes>[]): string[] {
    const constraintsQueries: string[] = [];

    const primaryKeyConstraint = this.getPrimaryKeyConstraint(columns);
    if (primaryKeyConstraint) constraintsQueries.push(primaryKeyConstraint);

    columns.forEach((column) => {
      if (column.isUnique) {
        constraintsQueries.push(this.getUniqueColumnConstraint(column.name));
      }
    });

    return constraintsQueries;
  }

  public getBeforeSqlQueries(): string {
    return this.beforeSqlQueries.length
      ? `${this.beforeSqlQueries.join('; ')}; `
      : '';
  }

  public getCreateTableSql(
    tableName: string,
    columns: ColumnProps<AllowedTypes>[],
  ): string {
    const mainQuery = `${this.createTableStatement} ${tableName} (${[
      ...this.getColumns(columns),
      ...this.getConstraints(columns),
    ].join(',')})`;

    return `${this.getBeforeSqlQueries()} ${mainQuery}`;
  }

  public getDropTableSql(tableName: string): string {
    return `${this.dropTableStatement} ${tableName}`;
  }
}

export default BaseTableBuilder;
