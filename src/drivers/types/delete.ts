import { Where } from './where';
import { PropertyKeyTypes } from '../../types/global';

export type DeleteProps<ColumnNames extends PropertyKeyTypes> = {
  tableName: string;
  where: Where<ColumnNames>;
  returnDeletedRows?: boolean;
};
