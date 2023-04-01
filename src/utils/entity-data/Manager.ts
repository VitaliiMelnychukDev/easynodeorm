import {
  PreparedColumnsData,
  EntityRelation,
  EntityTableAndColumns,
  PreparedEntityData,
  EntityDataStoreKey,
} from '../../types/entity-data/entity';
import { ObjectType } from '../../types/object';
import Validator from './Validator';
import Provider from './Provider';
import { QueryOperation } from '../../types/entity-data/validation';

class Manager {
  public static validateAndGetDataForOperation(
    entityClass: EntityDataStoreKey,
    entity: ObjectType = {},
    operation = QueryOperation.Insert,
  ): PreparedEntityData {
    new Validator(entityClass, entity).validate(operation);

    return new Provider(entityClass, entity).getEntityData(operation);
  }

  public static validateAndGetColumnsPreparedData(
    entityClass: EntityDataStoreKey,
    entity: ObjectType = {},
  ): PreparedColumnsData[] {
    const entityColumns = Object.keys(entity);
    new Validator(entityClass, entity).validateProperties(entityColumns);

    return new Provider(entityClass, entity).getPreparedColumns(entityColumns);
  }

  public static validateAndGetRelations(
    entityClass: EntityDataStoreKey,
    entity: ObjectType = {},
  ): Record<string, EntityRelation> {
    new Validator(entityClass, entity).validaRelations();

    return new Provider(entityClass, entity).getRelationsData();
  }

  public static validateAndGetTableAndColumnsData(
    entityClass: EntityDataStoreKey,
  ): EntityTableAndColumns {
    new Validator(entityClass, {}).validateTableAndColumnsData();

    return new Provider(entityClass, {}).getTableAndColumnsData();
  }
}

export default Manager;
