import {
  Column,
  Entity,
  IsInteger,
  IsUnsigned,
  Length,
  PrimaryAutoIncrementColumn,
  ManyToOne,
} from '../../../decorators';
import User from './User';
import BaseModel from './BaseModel';

@Entity('products')
class Product extends BaseModel {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(3, 256)
  @Column()
  name: string;

  @IsUnsigned()
  @Column()
  price: number;

  @IsInteger()
  @IsUnsigned()
  @Column({
    customName: 'user_id',
  })
  userId: number;

  @ManyToOne({
    field: 'userId',
    relatedEntityField: 'id',
    getRelatedEntity: () => User,
  })
  user: User;
}

export default Product;
