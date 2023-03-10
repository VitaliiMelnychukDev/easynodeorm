import { DataManipulationQueryManagerProps } from './types/queryManager';
import BaseInsertBuilder from './base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from './types/insertBuilder';
import { Operation } from './consts/operation';

abstract class DataManipulationQueryManager {
  abstract query<T>(query: string, operation: string): Promise<T[]>;

  protected queryBuilders: Required<DataManipulationQueryManagerProps>;

  protected constructor(props: DataManipulationQueryManagerProps) {
    this.queryBuilders = {
      insertBuilder: props.insertBuilder || new BaseInsertBuilder(),
    };
  }

  async insert<T>(tableName: string, rows: InsertBuilderRows): Promise<T[]> {
    const query = this.queryBuilders.insertBuilder.getQuery(tableName, rows);

    return await this.query<T>(query, Operation.Insert);
  }
}

export default DataManipulationQueryManager;
