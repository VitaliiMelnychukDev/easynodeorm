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

  @Length(2, 256)
  @Column()
  name: string;

  @IsInteger()
  @IsUnsigned()
  @Column()
  age: number;

  @Length(5, 50)
  @Column()
  email: string;

  @Column({
    defaultValue: false,
  })
  active: boolean;

  @IsInteger()
  @IsUnsigned()
  @Column({
    customName: 'address_id',
  })
  addressId: number;

  @Enum([Role.Admin, Role.Customer])
  @Column()
  role: Role;

  @OneToOne({
    field: 'addressId',
    relatedEntityField: 'id',
    getRelatedEntity: () => Address,
  })
  address: Address;

  @OneToMany({
    field: 'id',
    relatedEntityField: 'userId',
    getRelatedEntity: () => Product,
  })
  products: Product[];

  @ManyToMany({
    getRelatedEntity: () => Tag,
    intermediateTable: {
      name: 'user_tags',
      fieldNames: {
        currentEntityField: 'id',
        relatedEntityField: 'id',
        currentTableIntermediateField: 'user_id',
        relatedTableIntermediateField: 'tag_id',
      },
    },
  })
  tags: Tag[];
}

export default User;
