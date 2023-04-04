import BaseSeparateConnectionManager from '../BaseSeparateConnectionManager';
import { AllowedMySqlTypes } from './types/types';
import { MySqlClient } from './types/connection';
import MySqlQueryManager from './MySqlQueryManager';
import DataDefinitionMySqlQueryManager from './DataDefinitionMySqlQueryManager';
import { PropertyClassType } from '../../types/object';
import BaseRepository from '../BaseRepository';
import { TransactionIsolationLevel } from './types';
import MySqlTransactionBuilder from './query-builders/MySqlTransactionBuilder';

class MysqlSeparateConnectionManager extends BaseSeparateConnectionManager<AllowedMySqlTypes> {
  private readonly client: MySqlClient;

  public readonly queryManager: MySqlQueryManager;

  public readonly dataDefinitionQueryManager: DataDefinitionMySqlQueryManager;

  public constructor(client: MySqlClient) {
    super();

    this.client = client;
    this.queryManager = new MySqlQueryManager(this.client);
    this.dataDefinitionQueryManager = new DataDefinitionMySqlQueryManager(
      this.client,
    );
  }

  async startTransaction(
    isolationLevel?: TransactionIsolationLevel,
  ): Promise<void> {
    if (isolationLevel) {
      await this.setTransactionLevel(isolationLevel);
    }

    const startTransactionSql =
      MySqlTransactionBuilder.getStartTransactionSql();

    await this.client.query(startTransactionSql);

    await this.client.query(startTransactionSql);
  }

  async commitTransaction(): Promise<void> {
    const commitTransactionSql =
      MySqlTransactionBuilder.getCommitTransactionSql();

    await this.client.query(commitTransactionSql);
  }

  async rollbackTransaction(): Promise<void> {
    const rollbackTransactionSql =
      MySqlTransactionBuilder.getRollbackTransactionSql();

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

  private async setTransactionLevel(
    isolationLevel: TransactionIsolationLevel,
  ): Promise<void> {
    const isolationLevelSql =
      MySqlTransactionBuilder.getSetIsolationLevelSql(isolationLevel);

    await this.client.query(isolationLevelSql);
  }
}

export default MysqlSeparateConnectionManager;
