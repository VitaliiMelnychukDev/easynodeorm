import { ObjectType } from '../../types/object';
import {
  ManyToManyProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const ManyToMany =
  (props: ManyToManyProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.ManyToMany,
      getRelatedEntity: props.getRelatedEntity,
      intermediateTable: props.intermediateTable,
    });
  };

export default ManyToMany;
