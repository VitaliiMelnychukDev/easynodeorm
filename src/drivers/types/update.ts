import { Where } from './where';
import { ColumnDataToHandel } from '../../types/entity-data/entity';
import { PropertyKeyTypes } from '../../types/global';

export type UpdateProps<ColumnNames extends PropertyKeyTypes> = {
  tableName: string;
  where: Where<ColumnNames>;
  columns: ColumnDataToHandel[];
  returnUpdatedRows?: boolean;
};
