import InsertBuilder from './builders/InsertBuilder';
import TableBuilder from './builders/TableBuilder';
import SelectBuilder from './builders/SelectBuilder';
import ForeignKeyBuilder from './builders/ForeignKeyBuilder';
import IndexBuilder from './builders/IndexBuilder';
import DeleteBuilder from './builders/DeleteBuilder';
import UpdateBuilder from './builders/UpdateBuilder';

export type DataDefinitionQueryManagerProps<AllowedTypes> = {
  createTableBuilder?: TableBuilder<AllowedTypes>;
  foreignKeyBuilder?: ForeignKeyBuilder;
  indexBuilder?: IndexBuilder;
};

export type DataManipulationQueryManagerProps = {
  insertBuilder?: InsertBuilder;
  selectBuilder?: SelectBuilder;
  deleteBuilder?: DeleteBuilder;
  updateBuilder?: UpdateBuilder;
};
