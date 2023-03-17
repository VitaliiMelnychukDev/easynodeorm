import { ObjectType } from '../../types/object';
import { OneToOneProps, RelationType } from '../../types/entity-data/relations';
import { EntityDataStore } from '../../utils/entity-data';
import { DecoratorPropertyKey } from '../../types/entity-data/decorator';

const OneToOne =
  (props: OneToOneProps): PropertyDecorator =>
  (target: ObjectType, propertyKey: DecoratorPropertyKey): void => {
    EntityDataStore.setRelation(target, propertyKey, {
      relationType: RelationType.OneToOne,
      field: props.field,
      relatedEntityField: props.relatedEntityField,
      getRelatedEntity: props.getRelatedEntity,
    });
  };

export default OneToOne;
