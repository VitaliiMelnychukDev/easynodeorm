import { ObjectType } from '../../types/object';
import {
  EntityRelationFieldLocation,
  OneToOneProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';

const OneToOne =
  (props: OneToOneProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.OneToOne,
      relatedField: {
        fieldName: props.relatedField,
        location:
          props.fieldLocation || EntityRelationFieldLocation.CurrentEntity,
      },
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default OneToOne;
