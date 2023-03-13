import { Select } from '../select';
import { Where } from '../where';

export interface SelectBuilder {
  getWhereSql(where?: Where): string;
  getSelectSql(options: Select): string;
}

export default SelectBuilder;
