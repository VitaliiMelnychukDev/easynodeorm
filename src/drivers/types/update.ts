import { Where } from './where';
import { PreparedColumnsData } from '../../types/entity-data/entity';
import { PropertyKeyTypes } from '../../types/object';

export type UpdateProps<ColumnNames extends PropertyKeyTypes> = {
  tableName: string;
  where: Where<ColumnNames>;
  columns: PreparedColumnsData[];
  returnUpdatedRows?: boolean;
};
