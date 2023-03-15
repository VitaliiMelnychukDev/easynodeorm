import { ColumnProps } from '../../drivers/types/createTable';
import { AllowedTypes } from '../../drivers/postgress/types/types';

export const columnsUserTags: ColumnProps<AllowedTypes>[] = [
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
