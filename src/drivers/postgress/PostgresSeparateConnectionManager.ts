import BaseSeparateConnectionManager from '../BaseSeparateConnectionManager';
import { AllowedPostgresTypes } from './types/types';
import { PostgresClient } from './types/connection';
import PostgresQueryManager from './PostgresQueryManager';
import DataDefinitionPostgresQueryManager from './DataDefinitionPostgresQueryManager';
import { PropertyClassType } from '../../types/object';
import BaseRepository from '../BaseRepository';
import { TransactionIsolationLevel } from './types/transaction';
import PostgresTransactionBuilder from './query-builders/PostgresTransactionBuilder';

class PostgresSeparateConnectionManager extends BaseSeparateConnectionManager<AllowedPostgresTypes> {
  private readonly client: PostgresClient;

  public readonly queryManager: PostgresQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionPostgresQueryManager;

  public constructor(client: PostgresClient) {
    super();

    this.client = client;
    this.queryManager = new PostgresQueryManager(this.client);
    this.dataDefinitionQueryManager = new DataDefinitionPostgresQueryManager(
      this.client,
    );
  }

  async startTransaction(
    isolationLevel?: TransactionIsolationLevel,
  ): Promise<void> {
    const startTransactionSql =
      PostgresTransactionBuilder.getStartTransactionSql(isolationLevel);

    await this.client.query(startTransactionSql);
  }

  async commitTransaction(): Promise<void> {
    const commitTransactionSql =
      PostgresTransactionBuilder.getCommitTransactionSql();

    await this.client.query(commitTransactionSql);
  }

  async rollbackTransaction(): Promise<void> {
    const rollbackTransactionSql =
      PostgresTransactionBuilder.getRollbackTransactionSql();

    await this.client.query(rollbackTransactionSql);
  }

  async releaseConnection(): Promise<void> {
    await this.client.release();
  }

  getRepository<Entity>(
    entityClass: PropertyClassType<Entity>,
  ): BaseRepository<Entity> {
    return new BaseRepository<Entity>(this.queryManager, entityClass);
  }
}

export default PostgresSeparateConnectionManager;
