import SqlBaseDriver from '../drivers/SqlBaseDriver';
import DataDefinitionQueryManager from '../drivers/DataDefinitionQueryManager';
import DataManipulationQueryManager from '../drivers/DataManipulationQueryManager';

export enum SupportedDatabaseNames {
  Postgres = 'postgres',
}

export type SupportedDatabases = SupportedDatabaseNames.Postgres;

export type AllowedPropertiesTypes =
  | string
  | boolean
  | number
  | null
  | undefined;

export type AllowedTypesToUseInSqlQuery = string | boolean | number;

export const isValidDataSource = (
  dataSource: unknown,
): dataSource is SqlBaseDriver<unknown> => {
  return (
    typeof dataSource === 'object' &&
    'queryManager' in dataSource &&
    dataSource.queryManager instanceof DataManipulationQueryManager &&
    'dataDefinitionQueryManager' in dataSource &&
    dataSource.dataDefinitionQueryManager instanceof DataDefinitionQueryManager
  );
};
