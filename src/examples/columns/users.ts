import {
  AutoGenerationStrategy,
  ColumnProps,
} from '../../drivers/types/createTable';
import { AllowedPostgresTypes } from '../../drivers/postgress/types/types';

export const columnsUser: ColumnProps<AllowedPostgresTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: AutoGenerationStrategy.Increment,
  },
  {
    name: 'name',
    type: 'varchar',
    length: 256,
  },
  {
    name: 'age',
    type: 'smallint',
  },
  {
    name: 'email',
    type: 'varchar',
    length: 50,
    isUnique: true,
  },
  {
    name: 'active',
    type: 'boolean',
    default: false,
  },
  {
    name: 'address_id',
    type: 'int',
    isUnique: true,
  },
  {
    name: 'role',
    type: 'enum',
    enum: ['Admin', 'Customer'],
    enumTypeName: 'user_role',
  },
];
