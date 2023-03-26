import { IndexTypes } from '../indexTypes';

interface IndexBuilder {
  getCreateIndexSql(index: IndexTypes): string;
  getDropIndexSql(indexName: string): string;
}

export default IndexBuilder;
