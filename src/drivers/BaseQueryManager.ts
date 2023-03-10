import { QueryMarks, QueryManagerProps } from './types/QueryManager';
import BaseInsertBuilder from './base-query-builders/BaseInsertBuilder';
import { InsertBuilderRows } from './types/insertBuilder';
import { defaultQueryMarks } from './consts/queryMarks';
import { Operation } from './consts/operation';

abstract class BaseQueryManager {
  abstract query<T>(query: string, operation: string): Promise<T[]>;

  protected queryBuilders: Required<QueryManagerProps>;
  protected constructor(props: QueryManagerProps) {
    const queryMarks: QueryMarks = {
      stringPropertiesQuote:
        props.stringPropertiesQuote || defaultQueryMarks.stringPropertiesQuote,
      propertiesDivider:
        props.propertiesDivider || defaultQueryMarks.propertiesDivider,
    };

    this.queryBuilders = {
      insertBuilder: props.insertBuilder || new BaseInsertBuilder(queryMarks),
      ...queryMarks,
    };
  }

  async insert<T>(tableName: string, rows: InsertBuilderRows): Promise<T[]> {
    const query = this.queryBuilders.insertBuilder.getQuery(tableName, rows);

    return await this.query<T>(query, Operation.Insert);
  }
}

export default BaseQueryManager;
