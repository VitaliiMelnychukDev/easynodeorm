import {
  AutoGenerationStrategy,
  ColumnProps,
} from '../../drivers/types/createTable';
import { AllowedPostgresTypes } from '../../drivers/postgress/types/types';

export const columnsAddresses: ColumnProps<AllowedPostgresTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: AutoGenerationStrategy.Increment,
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
