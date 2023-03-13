import { DataManipulationQueryManagerProps } from './types/queryManager';
import BaseInsertBuilder from './base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from './types/insert';
import { Operation } from './consts/operation';
import SelectBuilder from './base-query-builders/BaseSelectBuilder';
import { Select } from './types/select';
import BaseDeleteBuilder from './base-query-builders/BaseDeleteBuilder';
import { DeleteProps } from './types/delete';

abstract class DataManipulationQueryManager {
  abstract query<T>(query: string, operation: string): Promise<T[]>;

  protected queryBuilders: Required<DataManipulationQueryManagerProps>;

  protected constructor(props: DataManipulationQueryManagerProps) {
    const selectBuilder = props.selectBuilder || new SelectBuilder();

    this.queryBuilders = {
      insertBuilder: props.insertBuilder || new BaseInsertBuilder(),
      selectBuilder,
      deleteBuilder:
        props.deleteBuilder || new BaseDeleteBuilder(selectBuilder),
    };
  }

  async insert<T>(tableName: string, rows: InsertBuilderRows): Promise<T[]> {
    const insertQuery = this.queryBuilders.insertBuilder.getInsertSql(
      tableName,
      rows,
    );

    return await this.query<T>(insertQuery, Operation.Insert);
  }

  async select<T>(select: Select): Promise<T[]> {
    const selectQuery = this.queryBuilders.selectBuilder.getSelectSql(select);

    return await this.query<T>(selectQuery, Operation.Select);
  }

  async delete<T>(props: DeleteProps): Promise<T[]> {
    const deleteQuery = this.queryBuilders.deleteBuilder.getDeleteSql(props);

    return await this.query<T>(deleteQuery, Operation.Delete);
  }
}

export default DataManipulationQueryManager;
