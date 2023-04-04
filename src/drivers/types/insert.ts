import { PreparedColumnsData } from '../../types/entity-data/entity';

export type RowsToInsert = PreparedColumnsData[][];

export type InsertOptions = {
  singlePrimaryKeyFieldName?: string;
};
