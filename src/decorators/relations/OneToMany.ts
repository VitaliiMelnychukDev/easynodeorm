import { ObjectType } from '../../types/object';
import {
  EntityRelationFieldLocation,
  OneToManyProps,
  RelationType,
} from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';

const OneToMany =
  (props: OneToManyProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.OneToMany,
      relatedField: {
        fieldName: props.relatedEntityField,
        location: EntityRelationFieldLocation.RelatedEntity,
      },
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default OneToMany;
