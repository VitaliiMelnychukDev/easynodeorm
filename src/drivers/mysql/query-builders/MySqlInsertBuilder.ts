import BaseInsertBuilder from '../../query-builders/BaseInsertBuilder';
import { InsertOptions, RowsToInsert } from '../../types';

class MySqlInsertBuilder extends BaseInsertBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsertSql(
    tableName: string,
    rows: RowsToInsert,
    options: InsertOptions,
  ): string {
    if (!options.singlePrimaryKeyFieldName) return '';

    return `; Select * from ${tableName} ORDER BY ${options.singlePrimaryKeyFieldName} DESC limit ${rows.length}`;
  }
}

export default MySqlInsertBuilder;
