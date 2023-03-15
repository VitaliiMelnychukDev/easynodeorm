import { OrderBy } from './order';
import { Join } from './join';
import { Where } from './where';
import { Column } from './column';
import { Table } from './table';
import { PropertyKeyTypes } from '../../types/global';

export type Select<ColumnNames extends PropertyKeyTypes> = {
  table: Table;
  columns?: Column[];
  where?: Where<ColumnNames>;
  having?: Where<ColumnNames>;
  groupBy?: string[];
  joins?: Join[];
  order?: OrderBy[];
  limit?: number;
  offset?: number;
};

export const isSelect = (select: any): select is Select<string> => {
  return typeof select === 'object' && select.table !== undefined;
};
