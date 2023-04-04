import { IndexTypes } from '../types/indexTypes';
import WrongIndexQuery from '../../error/WrongIndexQuery';
import IndexBuilder from '../types/builders/IndexBuilder';

class BaseIndexBuilder implements IndexBuilder {
  validateIndex(index: IndexTypes): void {
    if (!index.table || !index.indexName || !index.tableColumns.length) {
      throw new WrongIndexQuery(
        'table, indexKeyName, tableColumns params can not be empty in create index query.',
      );
    }
  }

  getCreateIndexSql(index: IndexTypes): string {
    index.tableColumns = index.tableColumns.filter(
      (tableColumn) => !!tableColumn,
    );
    this.validateIndex(index);

    return `CREATE INDEX ${index.indexName} ON ${
      index.table
    }(${index.tableColumns.join(',')})`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDropIndexSql(indexName: string, tableName?: string): string {
    if (!indexName) {
      throw new WrongIndexQuery(
        'indexName can not be empty in drop index query',
      );
    }

    return `DROP INDEX ${indexName}`;
  }
}

export default BaseIndexBuilder;
