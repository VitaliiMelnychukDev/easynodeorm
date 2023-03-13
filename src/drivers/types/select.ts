import { OrderBy } from './order';
import { Join } from './join';
import { Where } from './where';
import { Column } from './column';
import { Table } from './table';

export type Select = {
  table: Table;
  columns?: Column[];
  where?: Where;
  having?: Where;
  groupBy?: string[];
  joins?: Join[];
  order?: OrderBy[];
  limit?: number;
  offset?: number;
};

export const isSelect = (select: any): select is Select => {
  return typeof select === 'object' && select.table !== undefined;
};
