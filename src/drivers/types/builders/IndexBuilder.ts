import { Index } from '../index';

interface IndexBuilder {
  getCreateIndexSql(index: Index): string;
  getDropIndexSql(indexName: string): string;
}

export default IndexBuilder;
