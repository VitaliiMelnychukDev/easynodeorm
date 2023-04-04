import {
  AddColumnProps,
  ChangeColumnType,
  ColumnProps,
  DefaultValueTypes,
} from '../types/createTable';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import WrongTableQuery from '../../error/WrongTableQuery';
import TableBuilder from '../types/builders/TableBuilder';

class BaseTableBuilder<AllowedTypes> implements TableBuilder<AllowedTypes> {
  private beforeSqlQueries: string[] = [];

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
      ? `DEFAULT ${
          column.default !== null
            ? QueryBuilderHelper.prepareValue(column.default)
            : null
        }`
      : 'NOT NULL';
  }

  public getUnsignedPart(
    isUnsigned?: ColumnProps<AllowedTypes>['isUnsigned'],
  ): string {
    return isUnsigned ? 'UNSIGNED' : '';
  }

  public getEnumColumn(column: ColumnProps<AllowedTypes>): string {
    if (column.type !== 'enum') {
      return '';
    }

    if (!column.enum?.length) {
      throw new WrongTableQuery(
        'enum properties is required for enum type column.',
      );
    }

    return `${column.name} ${this.getColumnTypePart(
      'ENUM',
      column.length,
    )} ${QueryBuilderHelper.getEnumValuesQuery(column.enum)}`;
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
    return `${this.getSimpleColumn(column)} AUTO_INCREMENT`;
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

    return primaryKeys.length ? `PRIMARY KEY (${primaryKeys.join(',')})` : '';
  }

  public getUniqueColumnConstraint(columnName: string): string {
    return `UNIQUE(${columnName})`;
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

  public validateTableName(tableName: string, queryName: string): void {
    if (!tableName) {
      throw new WrongTableQuery(
        `Table name is required for ${queryName} query`,
      );
    }
  }

  public validateColumn(column: ColumnProps<AllowedTypes>): void {
    if (!column.name) {
      throw new WrongTableQuery('Column name can not be empty');
    }
  }

  public validateColumns(columns: ColumnProps<AllowedTypes>[]): void {
    if (!columns.length) {
      throw new WrongTableQuery(`Minimum one column required for table.`);
    }
    columns.forEach((column) => this.validateColumn(column));
  }

  public getCreateTableSql(
    tableName: string,
    columns: ColumnProps<AllowedTypes>[],
  ): string {
    this.validateTableName(tableName, 'Create table');
    this.validateColumns(columns);

    const mainQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${[
      ...this.getColumns(columns),
      ...this.getConstraints(columns),
    ].join(',')})`;

    return `${this.getBeforeSqlQueries()} ${mainQuery}`;
  }

  public getDropTableSql(tableName: string): string {
    this.validateTableName(tableName, 'Drop table');

    return `DROP TABLE IF EXISTS ${tableName}`;
  }

  public getAddColumnSql(
    tableName: string,
    column: AddColumnProps<AllowedTypes>,
  ): string {
    this.validateTableName(tableName, 'Add Column ');
    this.validateColumn(column);

    const mainQuery = `ALTER TABLE ${tableName} ADD COLUMN ${this.getColumn(
      column,
    )} ${column.isUnique ? 'UNIQUE' : ''}`;

    return `${this.getBeforeSqlQueries()} ${mainQuery}`;
  }

  public getDropColumnSql(tableName: string, columnName: string): string {
    this.validateTableName(tableName, 'Drop Column ');
    if (!columnName) {
      throw new WrongTableQuery(
        'columnName can not be empty for drop column query',
      );
    }

    return `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
  }

  public getRenameColumnSql(
    tableName: string,
    oldColumnName: string,
    newColumnName: string,
  ): string {
    if (!oldColumnName || !newColumnName) {
      throw new WrongTableQuery(
        'oldColumnName and newColumnName can not be empty for rename column query',
      );
    }

    return `ALTER TABLE ${tableName} RENAME COLUMN ${oldColumnName} TO ${newColumnName}`;
  }

  public getAlterColumnDefaultPart(
    tableName: string,
    columnName: string,
  ): string {
    return `ALTER TABLE ${tableName} ALTER COLUMN ${columnName}`;
  }

  public getDropColumnDefaultValueSql(
    tableName: string,
    columnName: string,
  ): string {
    this.validateTableName(tableName, 'Drop Column default value');
    if (!columnName) {
      throw new WrongTableQuery(
        'columnName can not be empty for Drop Column default value query',
      );
    }

    return `${this.getAlterColumnDefaultPart(
      tableName,
      columnName,
    )} DROP DEFAULT`;
  }

  public getSetColumnDefaultValueSql(
    tableName: string,
    columnName: string,
    defaultValue: DefaultValueTypes,
  ): string {
    this.validateTableName(tableName, 'Set Column default value');
    if (!columnName) {
      throw new WrongTableQuery(
        'columnName can not be empty for Set Column default value query',
      );
    }

    return `${this.getAlterColumnDefaultPart(
      tableName,
      columnName,
    )} SET DEFAULT ${QueryBuilderHelper.prepareValue(defaultValue)}`;
  }

  public getUsingPart(usingPart: string): string {
    return usingPart ? `USING ${usingPart}` : '';
  }
  public getChangeColumnTypeSql(
    tableName: string,
    column: ChangeColumnType<AllowedTypes>,
  ): string {
    this.validateTableName(tableName, 'Change column type');
    if (!column.name) {
      throw new WrongTableQuery(
        'column name can not be empty for Change column type query',
      );
    }

    return `${this.getAlterColumnDefaultPart(
      tableName,
      column.name,
    )} TYPE ${this.getColumnTypePart(
      column.newType,
      column.length,
    )} ${this.getUsingPart(column.usingPart)}`;
  }
}

export default BaseTableBuilder;
