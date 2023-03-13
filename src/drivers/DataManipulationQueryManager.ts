import { DataManipulationQueryManagerProps } from './types/queryManager';
import BaseInsertBuilder from './base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from './types/insert';
import { Operation } from './consts/operation';
import SelectBuilder from './base-query-builders/BaseSelectBuilder';
import { Select } from './types/select';

abstract class DataManipulationQueryManager {
  abstract query<T>(query: string, operation: string): Promise<T[]>;

  protected queryBuilders: Required<DataManipulationQueryManagerProps>;

  protected constructor(props: DataManipulationQueryManagerProps) {
    this.queryBuilders = {
      insertBuilder: props.insertBuilder || new BaseInsertBuilder(),
      selectBuilder: props.selectBuilder || new SelectBuilder(),
    };
  }

  async insert<T>(tableName: string, rows: InsertBuilderRows): Promise<T[]> {
    const query = this.queryBuilders.insertBuilder.getInsertSql(
      tableName,
      rows,
    );

    return await this.query<T>(query, Operation.Insert);
  }

  async select<T>(select: Select): Promise<T[]> {
    const query = this.queryBuilders.selectBuilder.getSelectSql(select);

    return await this.query<T>(query, Operation.Select);
  }
}

export default DataManipulationQueryManager;
