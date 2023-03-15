import {
  EntityRelation,
  EntityTableAndColumns,
  PreparedEntityData,
} from '../../types/entity-data/entity';
import { ObjectType, PropertyClassType } from '../../types/object';
import Validator from './Validator';
import Provider from './Provider';

class Manager {
  public static validateAndGetEntityData(
    entityClass: PropertyClassType<unknown>,
    entity: ObjectType = {},
  ): PreparedEntityData {
    new Validator(entityClass, entity).validate();

    return new Provider(entityClass, entity).getEntityData();
  }

  public static validateAndGetRelation(
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
