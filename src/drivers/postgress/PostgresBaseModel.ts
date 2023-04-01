import BaseModel from '../BaseModel';
import PostgresQueryManager from './PostgresQueryManager';

abstract class PostgresBaseModel extends BaseModel {
  protected constructor(queryManager: PostgresQueryManager) {
    super(queryManager);
  }
}

export default PostgresBaseModel;
