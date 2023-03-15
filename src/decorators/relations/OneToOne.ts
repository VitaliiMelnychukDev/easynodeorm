import { ObjectType } from '../../types/object';
import { OneToOneProps, RelationType } from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';

const OneToOne =
  (props: OneToOneProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: string | symbol): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.OneToOne,
      field: props.field,
      relatedEntityField: props.relatedEntityField,
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default OneToOne;
