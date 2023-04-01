import {
  Column,
  Entity,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../../decorators';
import User from './User';
import { OneToMany } from '../../../decorators';
import BaseModel from './BaseModel';

@Entity('addresses')
class Address extends BaseModel {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(3, 256)
  @Column()
  country: string;

  @Length(3, 256)
  @Column()
  city: string;

  @Length(3, 256)
  @Column({
    customName: 'postal_code',
  })
  postalCode: string;

  @Length(3, 1000)
  @Column()
  address: string;

  @OneToMany({
    field: 'id',
    relatedEntityField: 'addressId',
    getRelatedEntity: () => User,
  })
  user: User[];
}

export default Address;
