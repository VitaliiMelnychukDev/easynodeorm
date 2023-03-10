import { DataDefinitionQueryManagerProps } from './types/queryManager';
import BaseCreateTableBuilder from './base-query-builders/BaseCreateTableBuilder';
import { ColumnProps } from './types/createBuilder';
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
        props.createTableBuilder || new BaseCreateTableBuilder<AllowedTypes>(),
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

    const query = this.queryBuilders.createTableBuilder.buildCreateTableQuery(
      tableName,
      columnProps,
    );

    return await this.query(query, Operation.CreateTable);
  }
}

export default DataDefinitionQueryManager;
