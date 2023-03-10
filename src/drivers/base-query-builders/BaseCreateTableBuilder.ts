import { ColumnProps } from '../types/createBuilder';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import WrongCreateQuery from '../../error/WrongCreateQuery';

class BaseCreateTableBuilder<AllowedTypes> {
  private beforeSqlQueries: string[] = [];

  public dbEnumType = 'ENUM';

  public defaultStatement = 'DEFAULT';

  public notNullStatement = 'NOT NULL';

  public autoIncrementStatement = 'AUTO_INCREMENT';

  public unsignedStatement = 'UNSIGNED';

  public createTableStatement = 'CREATE TABLE IF NOT EXISTS';

  public primaryKeyStatement = 'PRIMARY KEY';

  public uniqueStatement = 'UNIQUE';

  public addBeforeSqlQuery(query: string): void {
    this.beforeSqlQueries.push(query);
  }

  public getLengthPartQuery(length?: number): string {
    return length ? `(${length})` : '';
  }

  public getTypePartQuery(
    type: AllowedTypes | string,
    length?: number,
  ): string {
    return `${type}${this.getLengthPartQuery(length)}`;
  }

  public getDefaultPartQuery(column: ColumnProps<AllowedTypes>): string {
    if (column.autoGenerationStrategy) return '';

    return column.default !== undefined
      ? `${this.defaultStatement} ${
          column.default !== null
            ? QueryBuilderHelper.prepareValue(column.default)
            : null
        }`
      : this.notNullStatement;
  }

  public getUnsignedPartQuery(
    isUnsigned?: ColumnProps<AllowedTypes>['isUnsigned'],
  ): string {
    return isUnsigned ? this.unsignedStatement : '';
  }

  public getEnumColumnQuery(column: ColumnProps<AllowedTypes>): string {
    if (column.type !== 'enum') {
      return '';
    }

    if (!column.enum?.length) {
      throw new WrongCreateQuery('enum properties for enum type column.');
    }

    return `${column.name} ${this.getTypePartQuery(
      this.dbEnumType,
      column.length,
    )} ${QueryBuilderHelper.getEnumValuesQuery(column.enum)})`;
  }

  public getSimpleColumnQuery(column: ColumnProps<AllowedTypes>): string {
    return `${column.name} ${this.getTypePartQuery(
      column.type,
      column.length,
    )} ${this.getUnsignedPartQuery(
      column.isUnsigned,
    )} ${this.getDefaultPartQuery(column)}`;
  }

  public getAutoIncrementedColumnQuery(
    column: ColumnProps<AllowedTypes>,
  ): string {
    return `${this.getSimpleColumnQuery(column)} ${
      this.autoIncrementStatement
    }`;
  }

  public getColumnQuery(column: ColumnProps<AllowedTypes>): string {
    if (column.type === 'enum') {
      return this.getEnumColumnQuery(column);
    }

    if (column.autoGenerationStrategy) {
      return this.getAutoIncrementedColumnQuery(column);
    }

    return this.getSimpleColumnQuery(column);
  }
  public getColumnsQueries(columns: ColumnProps<AllowedTypes>[]): string[] {
    return columns.map((column) => this.getColumnQuery(column));
  }

  public getPrimaryKeyConstraintQuery(
    columns: ColumnProps<AllowedTypes>[],
  ): string {
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

  public getUniqueColumnConstraintQuery(columnName: string): string {
    return `${this.uniqueStatement}(${columnName})`;
  }

  public getConstraintsQueries(columns: ColumnProps<AllowedTypes>[]): string[] {
    const constraintsQueries: string[] = [];

    const primaryKeyConstraint = this.getPrimaryKeyConstraintQuery(columns);
    if (primaryKeyConstraint) constraintsQueries.push(primaryKeyConstraint);

    columns.forEach((column) => {
      if (column.isUnique) {
        constraintsQueries.push(
          this.getUniqueColumnConstraintQuery(column.name),
        );
      }
    });

    return constraintsQueries;
  }

  public getBeforeSqlQueries(): string {
    return this.beforeSqlQueries.length
      ? `${this.beforeSqlQueries.join('; ')}; `
      : '';
  }

  public buildCreateTableQuery(
    tableName: string,
    columns: ColumnProps<AllowedTypes>[],
  ): string {
    const mainQuery = `${this.createTableStatement} ${tableName} (${[
      ...this.getColumnsQueries(columns),
      ...this.getConstraintsQueries(columns),
    ].join(',')})`;

    return `${this.getBeforeSqlQueries()} ${mainQuery}`;
  }
}

export default BaseCreateTableBuilder;
