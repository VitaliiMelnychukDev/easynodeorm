class BaseInsertBuilder {
  getQuery(tableName: string, properties: string[]): string {
    console.log('properties: ', properties);
    return tableName;
  }
}

export default BaseInsertBuilder;
