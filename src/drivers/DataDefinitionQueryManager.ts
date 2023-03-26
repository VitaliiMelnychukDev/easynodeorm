import { DataDefinitionQueryManagerProps } from './types/queryManager';
import BaseTableBuilder from './query-builders/BaseTableBuilder';
import {
  AddColumnProps,
  ChangeColumnType,
  ColumnProps,
  DefaultValueTypes,
} from './types/createTable';
import { Operation } from './consts/operation';
import BaseForeignKeyBuilder from './query-builders/BaseForeignKeyBuilder';
import { ForeignKey } from './types/foreignKey';
import BaseIndexBuilder from './query-builders/BaseIndexBuilder';
import { IndexTypes } from './types/indexTypes';

abstract class DataDefinitionQueryManager<AllowedTypes> {
  abstract query(query: string, operation: string): Promise<unknown>;

  protected queryBuilders: Required<
    DataDefinitionQueryManagerProps<AllowedTypes>
  >;

  protected constructor(props: DataDefinitionQueryManagerProps<AllowedTypes>) {
    this.queryBuilders = {
      tableBuilder: props.tableBuilder || new BaseTableBuilder<AllowedTypes>(),
      foreignKeyBuilder: props.foreignKeyBuilder || new BaseForeignKeyBuilder(),
      indexBuilder: props.indexBuilder || new BaseIndexBuilder(),
    };
  }

  async createTable(
    tableName: string,
    columnProps: ColumnProps<AllowedTypes>[],
  ): Promise<unknown> {
    const createTableQuery = this.queryBuilders.tableBuilder.getCreateTableSql(
      tableName,
      columnProps,
    );

    return await this.query(createTableQuery, Operation.CreateTable);
  }

  async dropTable(tableName: string): Promise<unknown> {
    const dropTableQuery =
      this.queryBuilders.tableBuilder.getDropTableSql(tableName);

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

  async createIndex(index: IndexTypes): Promise<unknown> {
    const createIndexQuery =
      this.queryBuilders.indexBuilder.getCreateIndexSql(index);

    return await this.query(createIndexQuery, Operation.CreateIndex);
  }

  async dropIndex(indexName: string): Promise<unknown> {
    const dropIndexQuery =
      this.queryBuilders.indexBuilder.getDropIndexSql(indexName);

    return await this.query(dropIndexQuery, Operation.DropIndex);
  }

  async addColumn(
    tableName: string,
    column: AddColumnProps<AllowedTypes>,
  ): Promise<unknown> {
    const addColumnSql = this.queryBuilders.tableBuilder.getAddColumnSql(
      tableName,
      column,
    );

    return await this.query(addColumnSql, Operation.AddColumn);
  }

  async dropColumn(tableName: string, columnName: string): Promise<unknown> {
    const dropColumnSql = this.queryBuilders.tableBuilder.getDropColumnSql(
      tableName,
      columnName,
    );

    return await this.query(dropColumnSql, Operation.DropColumn);
  }

  async renameColumn(
    tableName: string,
    oldColumnName: string,
    newColumnName: string,
  ): Promise<unknown> {
    const renameColumnSql = this.queryBuilders.tableBuilder.getRenameColumnSql(
      tableName,
      oldColumnName,
      newColumnName,
    );

    return await this.query(renameColumnSql, Operation.RenameColumn);
  }

  async dropColumnDefaultValue(
    tableName: string,
    columnName: string,
  ): Promise<unknown> {
    const dropColumnDefaultValueSql =
      this.queryBuilders.tableBuilder.getDropColumnDefaultValueSql(
        tableName,
        columnName,
      );

    return await this.query(
      dropColumnDefaultValueSql,
      Operation.DropColumnDefaultValue,
    );
  }

  async setColumnDefaultValue(
    tableName: string,
    columnName: string,
    defaultValue: DefaultValueTypes,
  ): Promise<unknown> {
    const setColumnDefaultValueSql =
      this.queryBuilders.tableBuilder.getSetColumnDefaultValueSql(
        tableName,
        columnName,
        defaultValue,
      );

    return await this.query(
      setColumnDefaultValueSql,
      Operation.SetColumnDefaultValue,
    );
  }

  async changeColumnType(
    tableName: string,
    column: ChangeColumnType<AllowedTypes>,
  ): Promise<unknown> {
    const changeColumnTypeSql =
      this.queryBuilders.tableBuilder.getChangeColumnTypeSql(tableName, column);

    return await this.query(changeColumnTypeSql, Operation.ChangeColumnType);
  }
}

export default DataDefinitionQueryManager;
