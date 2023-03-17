import {
  AutoGenerationStrategy,
  ColumnProps,
} from '../../drivers/types/createTable';
import { AllowedPostgresTypes } from '../../drivers/postgress/types/types';

export const columnsTags: ColumnProps<AllowedPostgresTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: AutoGenerationStrategy.Increment,
  },
  {
    name: 'name',
    type: 'varchar',
    length: 50,
  },
];
