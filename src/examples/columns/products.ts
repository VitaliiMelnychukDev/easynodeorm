import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedTypes } from '../../drivers/postgress/types/types';

export const columnsProducts: ColumnProps<AllowedTypes>[] = [
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
    name: 'price',
    type: 'float',
  },
  {
    name: 'user_id',
    type: 'int',
  },
];
