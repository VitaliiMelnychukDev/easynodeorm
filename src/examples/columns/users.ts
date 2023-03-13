import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedTypes } from '../../drivers/postgress/types/types';

export const columnsUser: ColumnProps<AllowedTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: 'increment',
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
