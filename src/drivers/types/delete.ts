import { Where } from './where';
import { PropertyKeyTypes } from '../../types/object';

export type DeleteProps<ColumnNames extends PropertyKeyTypes> = {
  tableName: string;
  where: Where<ColumnNames>;
  returnDeletedRows?: boolean;
};
