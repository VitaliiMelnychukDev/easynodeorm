import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedTypes } from '../../drivers/postgress/types/types';

export const columnsAddresses: ColumnProps<AllowedTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: 'increment',
  },
  {
    name: 'country',
    type: 'varchar',
    length: 256,
  },
  {
    name: 'city',
    type: 'varchar',
    length: 256,
  },
  {
    name: 'postal_code',
    type: 'varchar',
    length: 256,
  },
  {
    name: 'address',
    type: 'varchar',
    length: 1000,
  },
];
