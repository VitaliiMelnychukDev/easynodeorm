import BaseInsertBuilder from '../base-query-builders/BaseInsertBuilder';
import BaseCreateTableBuilder from '../base-query-builders/BaseCreateTableBuilder';

export type DataDefinitionQueryManagerProps<AllowedTypes> = {
  createTableBuilder?: BaseCreateTableBuilder<AllowedTypes>;
};

export type DataManipulationQueryManagerProps = {
  insertBuilder?: BaseInsertBuilder;
};
