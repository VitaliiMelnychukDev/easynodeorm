import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

const PrimaryKey =
  (): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPrimaryColumn(target, propertyKey);
  };

export default PrimaryKey;
