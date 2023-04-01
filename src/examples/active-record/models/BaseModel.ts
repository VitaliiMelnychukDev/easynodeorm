import PostgresBaseModel from '../../../drivers/postgress/PostgresBaseModel';
import postgresDataSource from '../../postgresDataSource';

abstract class BaseModel extends PostgresBaseModel {
  constructor() {
    super(postgresDataSource.queryManager);
  }
}

export default BaseModel;
