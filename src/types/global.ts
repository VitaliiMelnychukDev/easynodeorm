export enum SupportedDatabaseNames {
  Postgres = 'postgres',
  MySql = 'mysql',
}

export type SupportedDatabases =
  | SupportedDatabaseNames.Postgres
  | SupportedDatabaseNames.MySql;

export type AllowedPropertiesTypes =
  | string
  | boolean
  | number
  | null
  | undefined;

export type AllowedTypesToUseInSqlQuery = string | boolean | number;
