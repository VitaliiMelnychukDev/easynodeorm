import SelectBuilder from './SelectBuilder';
import { UpdateProps } from '../update';

interface UpdateBuilder {
  readonly selectBuilder: SelectBuilder;
  getUpdateSql(props: UpdateProps): string;
}

export default UpdateBuilder;
