import { ObjectType } from '../../types/object';
import {
  EntityRelationFieldLocation,
  ManyToOneProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';

const ManyToOne =
  (props: ManyToOneProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.ManyToOne,
      relatedField: {
        fieldName: props.relatedField,
        location: EntityRelationFieldLocation.CurrentEntity,
      },
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default ManyToOne;
