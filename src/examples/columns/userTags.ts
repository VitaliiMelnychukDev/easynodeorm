import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedPostgresTypes } from '../../drivers/postgress/types/types';

export const columnsUserTags: ColumnProps<AllowedPostgresTypes>[] = [
  {
    name: 'user_id',
    type: 'int',
    isPrimary: true,
  },
  {
    name: 'tag_id',
    type: 'int',
    isPrimary: true,
  },
];
