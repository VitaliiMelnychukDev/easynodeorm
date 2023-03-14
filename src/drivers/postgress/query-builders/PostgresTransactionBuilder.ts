import { TransactionIsolationLevel } from '../types/transaction';

class PostgresTransactionBuilder {
  public static getStartTransactionSql(
    isolationLevel?: TransactionIsolationLevel,
  ): string {
    const isolationLevelPart = isolationLevel
      ? `ISOLATION LEVEL ${isolationLevel}`
      : '';

    return `START TRANSACTION ${isolationLevelPart}`;
  }

  public static getCommitTransactionSql(): string {
    return 'COMMIT TRANSACTION';
  }

  public static getRollbackTransactionSql(): string {
    return 'ROLLBACK TRANSACTION';
  }
}

export default PostgresTransactionBuilder;
