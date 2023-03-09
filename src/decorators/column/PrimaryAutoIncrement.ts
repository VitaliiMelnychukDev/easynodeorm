import { ObjectType } from '../../types/object';
import { EntityDataStore } from '../../utils/entity-data';

const PrimaryAutoIncrement =
  (): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setPrimaryAutoIncrementColumn(target, propertyKey);
  };

export default PrimaryAutoIncrement;
