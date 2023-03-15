import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedTypes } from '../../drivers/postgress/types/types';

export const columnsTags: ColumnProps<AllowedTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: 'increment',
  },
  {
    name: 'name',
    type: 'varchar',
    length: 50,
  },
];
