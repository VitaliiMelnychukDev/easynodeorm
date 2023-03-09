import EntityDataSetter from '../../helpers/entity/EntityDataSetter';

const Entity = (tableName: string): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    EntityDataSetter.setCustomTableName(target.prototype, tableName);
  };
};

export default Entity;
