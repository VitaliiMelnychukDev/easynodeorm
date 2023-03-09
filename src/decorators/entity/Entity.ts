import { EntityDataStore } from '../../utils/entity-data';

const Entity = (tableName: string): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    EntityDataStore.setCustomTableName(target.prototype, tableName);
  };
};

export default Entity;
