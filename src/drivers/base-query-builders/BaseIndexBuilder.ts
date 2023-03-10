import { Index } from '../types';
import WrongIndexQuery from '../../error/WrongIndexQuery';
import IndexBuilder from '../types/builders/IndexBuilder';

class BaseIndexBuilder implements IndexBuilder {
  public createIndexStatement = 'CREATE INDEX';
  public dropIndexStatement = 'DROP INDEX';
  validateIndex(index: Index): void {
    if (!index.table || !index.indexName || !index.tableColumns.length) {
      throw new WrongIndexQuery(
        'table, indexKeyName, tableColumns params can not be empty in create index query.',
      );
    }
  }

  getCreateIndexSql(index: Index): string {
    index.tableColumns = index.tableColumns.filter(
      (tableColumn) => !!tableColumn,
    );
    this.validateIndex(index);

    return `${this.createIndexStatement} ${index.indexName} ON ${
      index.table
    }(${index.tableColumns.join(',')})`;
  }

  getDropIndexSql(indexName: string): string {
    if (!indexName) {
      throw new WrongIndexQuery(
        'indexName can not be empty in drop index query',
      );
    }

    return `${this.dropIndexStatement} ${indexName}`;
  }
}

export default BaseIndexBuilder;
