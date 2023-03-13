import postgresDataSource from './postgresDataSource';
import { columnsAddresses } from './columns/addresses';
import { columnsUser } from './columns/users';
import { ForeignKeyAction } from '../drivers/types/foreignKey';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tableQueriesExamples = async (): Promise<void> => {
  await postgresDataSource.dataDefinitionQueryManager.createTable(
    'addresses',
    columnsAddresses,
  );
  await postgresDataSource.dataDefinitionQueryManager.createTable(
    'users',
    columnsUser,
  );

  await postgresDataSource.dataDefinitionQueryManager.createIndex({
    table: 'users',
    tableColumns: ['email'],
    indexName: 'users_email',
  });
  await postgresDataSource.dataDefinitionQueryManager.createForeignKey({
    table: 'users',
    tableColumn: 'address_id',
    referenceTable: 'addresses',
    referenceTableColumn: 'id',
    foreignKeyName: 'users_address_id_address_id',
    onDelete: ForeignKeyAction.Cascade,
  });

  await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
    'users',
    'users_address_id_address_id',
  );
  await postgresDataSource.dataDefinitionQueryManager.dropIndex('users_email');

  await postgresDataSource.dataDefinitionQueryManager.dropTable('users');
  await postgresDataSource.dataDefinitionQueryManager.dropTable('addresses');
};
