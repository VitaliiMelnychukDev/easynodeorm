import { TransactionIsolationLevel } from '../types/transaction';

class MySqlTransactionBuilder {
  public static getStartTransactionSql(): string {
    return `START TRANSACTION`;
  }

  public static getSetIsolationLevelSql(
    isolationLevel: TransactionIsolationLevel,
  ): string {
    return `SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`;
  }

  public static getCommitTransactionSql(): string {
    return 'COMMIT';
  }

  public static getRollbackTransactionSql(): string {
    return 'ROLLBACK';
  }
}

export default MySqlTransactionBuilder;
