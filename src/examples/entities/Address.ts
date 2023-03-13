import {
  Column,
  Entity,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../decorators';

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
}

export default Address;
