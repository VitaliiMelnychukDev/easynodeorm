import { DataDefinitionQueryManagerProps } from './types/queryManager';
import BaseTableBuilder from './base-query-builders/BaseTableBuilder';
import { ColumnProps } from './types/createTable';
import WrongCreateQuery from '../error/WrongCreateQuery';
import { Operation } from './consts/operation';
import BaseForeignKeyBuilder from './base-query-builders/BaseForeignKeyBuilder';
import { ForeignKey } from './types/foreignKey';
import BaseIndexBuilder from './base-query-builders/BaseIndexBuilder';
import { Index } from './types';

abstract class DataDefinitionQueryManager<AllowedTypes> {
  abstract query(query: string, operation: string): Promise<unknown>;

  protected queryBuilders: Required<
    DataDefinitionQueryManagerProps<AllowedTypes>
  >;

  protected constructor(props: DataDefinitionQueryManagerProps<AllowedTypes>) {
    this.queryBuilders = {
      createTableBuilder:
        props.createTableBuilder || new BaseTableBuilder<AllowedTypes>(),
      foreignKeyBuilder: props.foreignKeyBuilder || new BaseForeignKeyBuilder(),
      indexBuilder: props.indexBuilder || new BaseIndexBuilder(),
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

    const createTableQuery =
      this.queryBuilders.createTableBuilder.getCreateTableSql(
        tableName,
        columnProps,
      );

    return await this.query(createTableQuery, Operation.CreateTable);
  }

  async dropTable(tableName: string): Promise<unknown> {
    const dropTableQuery =
      this.queryBuilders.createTableBuilder.getDropTableSql(tableName);

    return await this.query(dropTableQuery, Operation.DropTable);
  }

  async createForeignKey(foreignKey: ForeignKey): Promise<unknown> {
    const createForeignKeyQuery =
      this.queryBuilders.foreignKeyBuilder.getCreateForeignKeySql(foreignKey);

    return await this.query(createForeignKeyQuery, Operation.CreateForeignKey);
  }

  async dropForeignKey(
    tableName: string,
    foreignKeyName: string,
  ): Promise<unknown> {
    const dropForeignKeyQuery =
      this.queryBuilders.foreignKeyBuilder.getDropForeignKeySql(
        tableName,
        foreignKeyName,
      );

    return await this.query(dropForeignKeyQuery, Operation.DropForeignKey);
  }

  async createIndex(index: Index): Promise<unknown> {
    const createIndexQuery =
      this.queryBuilders.indexBuilder.getCreateIndexSql(index);

    return await this.query(createIndexQuery, Operation.CreateIndex);
  }

  async dropIndex(indexName: string): Promise<unknown> {
    const dropIndexQuery =
      this.queryBuilders.indexBuilder.getDropIndexSql(indexName);

    return await this.query(dropIndexQuery, Operation.DropIndex);
  }
}

export default DataDefinitionQueryManager;
