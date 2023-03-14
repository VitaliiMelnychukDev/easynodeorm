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

  @Length(256)
  @Column()
  name: string;

  @IsUnsigned()
  @Column()
  price: number;

  @IsInteger()
  @IsUnsigned()
  @Column({
    customName: 'user-id',
  })
  userId: number;

  @ManyToOne({
    relatedField: 'userId',
    getRelatedEntity: () => User,
  })
  user: User;
}

export default Product;
