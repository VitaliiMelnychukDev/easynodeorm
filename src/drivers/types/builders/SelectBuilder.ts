import { Select } from '../select';
import { Where } from '../where';

export interface SelectBuilder {
  getWhereSql(where?: Where<string>): string;
  getSelectSql(options: Select<string>): string;
}

export default SelectBuilder;
