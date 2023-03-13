import { Select } from '../select';

export interface SelectBuilder {
  getSelectSql(options: Select): string;
}

export default SelectBuilder;
