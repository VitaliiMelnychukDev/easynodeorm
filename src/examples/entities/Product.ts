import {
  Column,
  Entity,
  IsInteger,
  IsUnsigned,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../decorators';
import ManyToOne from '../../decorators/relations/ManyToOne';
import User from './User';

@Entity('products')
class Product {
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
