import BaseSeparateConnectionManager from '../BaseSeparateConnectionManager';
import { AllowedTypes } from './types/types';
import { PostgresClient } from './types/connection';
import PostgresQueryManager from './PostgresQueryManager';
import DataDefinitionPostgresQueryManager from './DataDefinitionPostgresQueryManager';
import { PropertyClassType } from '../../types/object';
import BaseRepository from '../BaseRepository';
import { TransactionIsolationLevel } from './types/transaction';
import PostgresTransactionBuilder from './query-builders/PostgresTransactionBuilder';

class PostgresSeparateConnectionManager extends BaseSeparateConnectionManager<AllowedTypes> {
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
    const startTransactionQuery =
      PostgresTransactionBuilder.getStartTransactionSql(isolationLevel);

    await this.client.query(startTransactionQuery);
  }

  async commitTransaction(): Promise<void> {
    const commitTransactionQuery =
      PostgresTransactionBuilder.getCommitTransactionSql();

    await this.client.query(commitTransactionQuery);
  }

  async rollbackTransaction(): Promise<void> {
    const rollbackTransactionQuery =
      PostgresTransactionBuilder.getRollbackTransactionSql();

    await this.client.query(rollbackTransactionQuery);
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
