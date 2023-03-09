import { QueryManagerProps } from './types/QueryManager';
import BaseInsertBuilder from './base-query-builders/BaseInsertBuilder';

abstract class BaseQueryManager {
  abstract query<T>(query: string, operation: string): Promise<T>;

  protected queryBuilders: Required<QueryManagerProps>;
  protected constructor(props: QueryManagerProps) {
    this.queryBuilders = {
      insertBuilder: props.insertBuilder || new BaseInsertBuilder(),
    };
  }

  async insert<T>(tableName: string, properties: string[]): Promise<T> {
    const query = this.queryBuilders.insertBuilder.getQuery(
      tableName,
      properties,
    );

    return await this.query<T>(query, 'save');
  }
}

export default BaseQueryManager;
