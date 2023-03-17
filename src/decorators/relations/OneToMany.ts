import { ObjectType } from '../../types/object';
import {
  OneToManyProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const OneToMany =
  (props: OneToManyProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.OneToMany,
      field: props.field,
      relatedEntityField: props.relatedEntityField,
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default OneToMany;
