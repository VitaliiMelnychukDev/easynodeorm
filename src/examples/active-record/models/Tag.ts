import {
  Column,
  Entity,
  Length,
  PrimaryAutoIncrementColumn,
  ManyToMany,
} from '../../../decorators';
import User from './User';
import BaseModel from '../../../drivers/BaseModel';

@Entity('tags')
class Tag extends BaseModel {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(2, 50)
  @Column()
  name: string;

  @ManyToMany({
    getRelatedEntity: () => User,
    intermediateTable: {
      name: 'user_tags',
      fieldNames: {
        currentEntityField: 'id',
        relatedEntityField: 'id',
        currentTableIntermediateField: 'tag_id',
        relatedTableIntermediateField: 'user_id',
      },
    },
  })
  users: User[];
}

export default Tag;
