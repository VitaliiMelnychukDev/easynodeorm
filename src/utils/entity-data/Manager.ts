import { PreparedEntityData } from '../../types/entity-data/entity';
import { ObjectType } from '../../types/object';
import Validator from './Validator';
import Provider from './Provider';

class Manager {
  public static validateAndGetEntityData(
    entity: ObjectType,
  ): PreparedEntityData {
    new Validator(entity).validate();

    return new Provider(entity).getEntityData();
  }
}

export default Manager;
