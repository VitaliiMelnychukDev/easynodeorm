import { ObjectType } from '../../types/object';
import {
  ManyToOneProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const ManyToOne =
  (props: ManyToOneProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.ManyToOne,
      field: props.field,
      relatedEntityField: props.relatedEntityField,
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default ManyToOne;
