import { DeleteProps } from '../delete';
import SelectBuilder from './SelectBuilder';

interface DeleteBuilder {
  readonly selectBuilder: SelectBuilder;
  getDeleteSql(props: DeleteProps<string>): string;
}

export default DeleteBuilder;
