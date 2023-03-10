import BaseCreateTableBuilder from '../base-query-builders/BaseCreateTableBuilder';
import { AllowedTypes } from './types/types';
import { ColumnProps } from '../types/createBuilder';
import WrongCreateQuery from '../../error/WrongCreateQuery';
import TypeHelper from './helpers/TypeHelper';

class PostgresCreateTableBuilder extends BaseCreateTableBuilder<AllowedTypes> {
  public getUnsignedPartQuery(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isUnsigned?: ColumnProps<AllowedTypes>['isUnsigned'],
  ): string {
    if (!isUnsigned) return '';

    throw new WrongCreateQuery(
      'Postgres does not support unsigned columns. Please use check statement instead.',
    );
  }

  public getAutoIncrementedColumnQuery(
    column: ColumnProps<AllowedTypes>,
  ): string {
    const autoIncrementedColumn: ColumnProps<AllowedTypes> = {
      ...column,
      type: 'serial',
    };

    return this.getSimpleColumnQuery(autoIncrementedColumn);
  }

  public getEnumColumnQuery(column: ColumnProps<AllowedTypes>): string {
    if (column.type !== 'enum') {
      return '';
    }

    if (!column.enum?.length || !column.enumTypeName) {
      throw new WrongCreateQuery(
        'enum properties and enumTypeName should be specified for postgres enum type column.',
      );
    }

    const typeName = column.enumTypeName;
    const typeQuery = TypeHelper.createTypeQuery(typeName, column.enum);
    this.addBeforeSqlQuery(typeQuery);

    return `${column.name} ${typeName} ${this.getDefaultPartQuery(column)}`;
  }
}

export default PostgresCreateTableBuilder;
