import { DataManipulationQueryManagerProps } from './types/queryManager';
import BaseInsertBuilder from './query-builders/BaseInsertBuilder';
import { RowsToInsert } from './types/insert';
import { Operation } from './consts/operation';
import SelectBuilder from './query-builders/BaseSelectBuilder';
import { Select } from './types/select';
import BaseDeleteBuilder from './query-builders/BaseDeleteBuilder';
import { DeleteProps } from './types/delete';
import BaseUpdateBuilder from './query-builders/BaseUpdateBuilder';
import { UpdateProps } from './types/update';

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
      updateBuilder:
        props.updateBuilder || new BaseUpdateBuilder(selectBuilder),
    };
  }

  async insert<T>(tableName: string, rows: RowsToInsert): Promise<T[]> {
    const insertQuery = this.queryBuilders.insertBuilder.getInsertSql(
      tableName,
      rows,
    );

    return await this.query<T>(insertQuery, Operation.Insert);
  }

  async select<T>(select: Select<string>): Promise<T[]> {
    const selectQuery = this.queryBuilders.selectBuilder.getSelectSql(select);

    return await this.query<T>(selectQuery, Operation.Select);
  }

  async update<T>(props: UpdateProps<string>): Promise<T[]> {
    const updateQuery = this.queryBuilders.updateBuilder.getUpdateSql(props);

    return await this.query<T>(updateQuery, Operation.Update);
  }

  async delete<T>(props: DeleteProps<string>): Promise<T[]> {
    const deleteQuery = this.queryBuilders.deleteBuilder.getDeleteSql(props);

    return await this.query<T>(deleteQuery, Operation.Delete);
  }
}

export default DataManipulationQueryManager;
