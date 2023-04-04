import BaseIndexBuilder from '../../query-builders/BaseIndexBuilder';
import WrongIndexQuery from '../../../error/WrongIndexQuery';

class MySqlIndexBuilder extends BaseIndexBuilder {
  getDropIndexSql(indexName: string, tableName?: string): string {
    const dropIndexSql = super.getDropIndexSql(indexName, tableName);
    if (!tableName) {
      throw new WrongIndexQuery(
        'tableName can not be empty in drop index query',
      );
    }

    return `${dropIndexSql} ON ${tableName}`;
  }
}

export default MySqlIndexBuilder;
