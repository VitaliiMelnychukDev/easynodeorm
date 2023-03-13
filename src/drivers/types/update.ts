import { Where } from './where';
import { ColumnDataToHandel } from '../../types/entity-data/entity';

export type UpdateProps = {
  tableName: string;
  where: Where;
  columns: ColumnDataToHandel[];
};
