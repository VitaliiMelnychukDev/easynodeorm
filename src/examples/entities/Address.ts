import {
  Column,
  Entity,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../decorators';
import OneToOne from '../../decorators/relations/OneToOne';
import User from './User';
import { EntityRelationFieldLocation } from '../../types/entity-data/relations';

@Entity('addresses')
class Address {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(256)
  @Column()
  country: string;

  @Length(256)
  @Column()
  city: string;

  @Length(256)
  @Column({
    customName: 'postal-code',
  })
  postalCode: string;

  @Length(1000)
  @Column()
  address: string;

  @OneToOne({
    relatedField: 'addressId',
    getRelatedEntity: () => User,
    fieldLocation: EntityRelationFieldLocation.RelatedEntity,
  })
  user: User;
}

export default Address;
