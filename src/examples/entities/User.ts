import {
  Column,
  Entity,
  Enum,
  IsInteger,
  IsUnsigned,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../decorators';

export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
}

@Entity('users')
class User {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(256)
  @Column()
  name: string;

  @IsInteger()
  @IsUnsigned()
  @Column()
  age: number;

  @Length(50)
  @Column()
  email: string;

  @Column({
    defaultValue: false,
  })
  active: boolean;

  @IsInteger()
  @IsUnsigned()
  @Column({
    customName: 'address-id',
  })
  addressId: number;

  @IsInteger()
  @Enum([Role.Admin, Role.Customer])
  @Column()
  role: Role;
}

export default User;
