import InsertBuilder from './builders/InsertBuilder';
import TableBuilder from './builders/TableBuilder';
import SelectBuilder from './builders/SelectBuilder';
import ForeignKeyBuilder from './builders/ForeignKeyBuilder';
import IndexBuilder from './builders/IndexBuilder';

export type DataDefinitionQueryManagerProps<AllowedTypes> = {
  createTableBuilder?: TableBuilder<AllowedTypes>;
  foreignKeyBuilder?: ForeignKeyBuilder;
  indexBuilder?: IndexBuilder;
};

export type DataManipulationQueryManagerProps = {
  insertBuilder?: InsertBuilder;
  selectBuilder?: SelectBuilder;
};
