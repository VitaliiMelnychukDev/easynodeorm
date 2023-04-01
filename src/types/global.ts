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
