import {
  Column,
  Entity,
  Enum,
  IsInteger,
  IsUnsigned,
  Length,
  PrimaryAutoIncrementColumn,
} from '../../decorators';
import Address from './Address';
import OneToOne from '../../decorators/relations/OneToOne';
import OneToMany from '../../decorators/relations/OneToMany';
import Product from './Product';
import ManyToMany from '../../decorators/relations/ManyToMany';
import Tag from './Tag';

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

  @OneToOne({
    relatedField: 'addressId',
    getRelatedEntity: () => Address,
  })
  address: Address;

  @OneToMany({
    relatedEntityField: 'userId',
    getRelatedEntity: () => Product,
  })
  products: Product[];

  @ManyToMany({
    getRelatedEntity: () => Tag,
    intermediateTable: {
      name: 'user_tags',
      fieldNames: {
        currentEntity: 'user_id',
        relatedEntity: 'tag_id',
      },
    },
  })
  tags: Tag[];
}

export default User;
