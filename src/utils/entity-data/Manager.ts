import { PreparedEntityData } from '../../types/entity-data/entity';
import { ObjectType, PropertyClassType } from '../../types/object';
import Validator from './Validator';
import Provider from './Provider';

class Manager {
  public static validateAndGetEntityData(
    entity: ObjectType,
    entityClass: PropertyClassType<unknown>,
  ): PreparedEntityData {
    new Validator(entity, entityClass).validate();

    return new Provider(entity, entityClass).getEntityData();
  }
}

export default Manager;
