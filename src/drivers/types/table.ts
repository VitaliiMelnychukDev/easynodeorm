import { RequiredAlias } from './base';
import { Select } from './select';

export type SubQueryWithAlias = {
  subQuery: Select<string>;
  alias: string;
};

export type Table = string | RequiredAlias | SubQueryWithAlias;

export const isSubQueryWithAlias = (
  table: Table,
): table is SubQueryWithAlias => {
  return (<SubQueryWithAlias>table).subQuery !== undefined;
};
