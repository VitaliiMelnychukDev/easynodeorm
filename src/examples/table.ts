import postgresDataSource from './postgresDataSource';
import { columnsAddresses } from './columns/addresses';
import { columnsUser } from './columns/users';
import { ForeignKeyAction } from '../drivers/types/foreignKey';
import { columnsTags } from './columns/tags';
import { columnsProducts } from './columns/products';
import { columnsUserTags } from './columns/userTags';

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

  await postgresDataSource.dataDefinitionQueryManager.createTable(
    'tags',
    columnsTags,
  );

  await postgresDataSource.dataDefinitionQueryManager.createTable(
    'user_tags',
    columnsUserTags,
  );

  await postgresDataSource.dataDefinitionQueryManager.createTable(
    'products',
    columnsProducts,
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

  await postgresDataSource.dataDefinitionQueryManager.createForeignKey({
    table: 'products',
    tableColumn: 'user_id',
    referenceTable: 'users',
    referenceTableColumn: 'id',
    foreignKeyName: 'products_user_id_users_id',
  });

  await postgresDataSource.dataDefinitionQueryManager.createForeignKey({
    table: 'user_tags',
    tableColumn: 'user_id',
    referenceTable: 'users',
    referenceTableColumn: 'id',
    foreignKeyName: 'user_tags_user_id_users_id',
  });

  await postgresDataSource.dataDefinitionQueryManager.createForeignKey({
    table: 'user_tags',
    tableColumn: 'tag_id',
    referenceTable: 'tags',
    referenceTableColumn: 'id',
    foreignKeyName: 'user_tags_tag_id_tags_id',
  });

  await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
    'user_tags',
    'user_tags_tag_id_tags_id',
  );

  await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
    'user_tags',
    'user_tags_user_id_users_id',
  );

  await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
    'products',
    'products_user_id_users_id',
  );

  await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
    'users',
    'users_address_id_address_id',
  );
  await postgresDataSource.dataDefinitionQueryManager.dropIndex('users_email');

  await postgresDataSource.dataDefinitionQueryManager.dropTable('users');
  await postgresDataSource.dataDefinitionQueryManager.dropTable('addresses');
};
