import { DataDefinitionQueryManagerProps } from './types/queryManager';
import BaseTableBuilder from './base-query-builders/BaseTableBuilder';
import { ColumnProps } from './types/createTable';
import WrongCreateQuery from '../error/WrongCreateQuery';
import { Operation } from './consts/operation';

abstract class DataDefinitionQueryManager<AllowedTypes> {
  abstract query(query: string, operation: string): Promise<unknown>;

  protected queryBuilders: Required<
    DataDefinitionQueryManagerProps<AllowedTypes>
  >;

  protected constructor(props: DataDefinitionQueryManagerProps<AllowedTypes>) {
    this.queryBuilders = {
      createTableBuilder:
        props.createTableBuilder || new BaseTableBuilder<AllowedTypes>(),
    };
  }

  async createTable(
    tableName: string,
    columnProps: ColumnProps<AllowedTypes>[],
  ): Promise<unknown> {
    if (!columnProps.length) {
      throw new WrongCreateQuery(
        `Minimum one column required for table. Please specify columns for ${tableName} table`,
      );
    }

    const query = this.queryBuilders.createTableBuilder.getCreateTableSql(
      tableName,
      columnProps,
    );

    return await this.query(query, Operation.CreateTable);
  }
}

export default DataDefinitionQueryManager;
