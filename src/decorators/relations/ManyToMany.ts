import { ObjectType } from '../../types/object';
import {
  ManyToManyProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';

const ManyToMany =
  (props: ManyToManyProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.ManyToMany,
      getRelatedEntity: props.getRelatedEntity,
      intermediateTable: props.intermediateTable,
    });
  };

export default ManyToMany;
