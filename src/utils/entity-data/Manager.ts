import {
  PreparedColumnsData,
  EntityRelation,
  EntityTableAndColumns,
  PreparedEntityData,
} from '../../types/entity-data/entity';
import { ObjectType, PropertyClassType } from '../../types/object';
import Validator from './Validator';
import Provider from './Provider';
import { QueryOperation } from '../../types/entity-data/validation';

class Manager {
  public static validateAndGetDataForOperation(
    entityClass: PropertyClassType<unknown>,
    entity: ObjectType = {},
    operation = QueryOperation.Insert,
  ): PreparedEntityData {
    new Validator(entityClass, entity).validate(operation);

    return new Provider(entityClass, entity).getEntityData(operation);
  }

  public static validateAndGetColumnsPreparedData(
    entityClass: PropertyClassType<unknown>,
    entity: ObjectType = {},
  ): PreparedColumnsData[] {
    const entityColumns = Object.keys(entity);
    new Validator(entityClass, entity).validateProperties(entityColumns);

    return new Provider(entityClass, entity).getPreparedColumns(entityColumns);
  }

  public static validateAndGetRelations(
    entityClass: PropertyClassType<unknown>,
    entity: ObjectType = {},
  ): Record<string, EntityRelation> {
    new Validator(entityClass, entity).validaRelations();

    return new Provider(entityClass, entity).getRelationsData();
  }

  public static validateAndGetTableAndColumnsData(
    entityClass: PropertyClassType<unknown>,
  ): EntityTableAndColumns {
    new Validator(entityClass, {}).validateTableAndColumnsData();

    return new Provider(entityClass, {}).getTableAndColumnsData();
  }
}

export default Manager;
