import InsertBuilder from './builders/InsertBuilder';
import TableBuilder from './builders/TableBuilder';
import SelectBuilder from './builders/SelectBuilder';

export type DataDefinitionQueryManagerProps<AllowedTypes> = {
  createTableBuilder?: TableBuilder<AllowedTypes>;
};

export type DataManipulationQueryManagerProps = {
  insertBuilder?: InsertBuilder;
  selectBuilder?: SelectBuilder;
};
