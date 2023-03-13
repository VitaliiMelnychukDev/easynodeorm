import BaseTableBuilder from '../../base-query-builders/BaseTableBuilder';
import { AllowedTypes } from '../types/types';
import { ColumnProps } from '../../types/createTable';
import WrongTableQuery from '../../../error/WrongTableQuery';
import TypeHelper from '../helpers/TypeHelper';

class PostgresCreateTableBuilder extends BaseTableBuilder<AllowedTypes> {
  public getUnsignedPart(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isUnsigned?: ColumnProps<AllowedTypes>['isUnsigned'],
  ): string {
    if (!isUnsigned) return '';

    throw new WrongTableQuery(
      'Postgres does not support unsigned columns. Please use check statement instead.',
    );
  }

  public getAutoIncrementedColumn(column: ColumnProps<AllowedTypes>): string {
    const autoIncrementedColumn: ColumnProps<AllowedTypes> = {
      ...column,
      type: 'serial',
    };

    return this.getSimpleColumn(autoIncrementedColumn);
  }

  public getEnumColumn(column: ColumnProps<AllowedTypes>): string {
    if (column.type !== 'enum') {
      return '';
    }

    if (!column.enum?.length || !column.enumTypeName) {
      throw new WrongTableQuery(
        'enum properties and enumTypeName should be specified for postgres enum type column.',
      );
    }

    const typeName = column.enumTypeName;
    const typeQuery = TypeHelper.createTypeQuery(typeName, column.enum);
    this.addBeforeSql(typeQuery);

    return `${column.name} ${typeName} ${this.getColumnDefaultPart(column)}`;
  }
}

export default PostgresCreateTableBuilder;
