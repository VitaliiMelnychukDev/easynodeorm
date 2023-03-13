import { ForeignKey, ForeignKeyAction } from '../types/foreignKey';
import { alterTableStatement } from '../consts/sqlStatements';
import WrongForeignKeyQuery from '../../error/WrongForeignKeyQuery';
import ForeignKeyBuilder from '../types/builders/ForeignKeyBuilder';

class BaseForeignKeyBuilder implements ForeignKeyBuilder {
  public alterTableStatement = alterTableStatement;
  public foreignKeyStatement = 'FOREIGN KEY';
  public referencesStatement = 'REFERENCES';
  public onDeleteStatement = 'ON DELETE';
  public onUpdateStatement = 'ON UPDATE';
  public dropConstrainStatement = 'DROP CONSTRAINT';
  public addConstraintStatement = 'ADD CONSTRAINT';

  getForeignKeyActionSql(foreignKeyAction: ForeignKeyAction): string {
    switch (foreignKeyAction) {
      case ForeignKeyAction.Cascade:
        return 'CASCADE';
      case ForeignKeyAction.NoAction:
        return 'NO ACTION';
      case ForeignKeyAction.Restrict:
        return 'RESTRICT';
      case ForeignKeyAction.SetDefault:
        return 'SET DEFAULT';
      case ForeignKeyAction.SetNull:
        return 'SET NULL';
    }
  }

  validateForeignKey(foreignKey: ForeignKey): void {
    if (
      !foreignKey.table ||
      !foreignKey.tableColumn ||
      !foreignKey.referenceTable ||
      !foreignKey.referenceTableColumn ||
      !foreignKey.foreignKeyName
    ) {
      throw new WrongForeignKeyQuery(
        'table, tableColumn, referenceTable, referenceTableColumn, foreignKeyName params can not be empty in create foreign key query.',
      );
    }
  }

  getConstraint(constraint: string, action?: ForeignKeyAction): string {
    return action ? `${constraint} ${this.getForeignKeyActionSql(action)}` : '';
  }
  getCreateForeignKeySql(foreignKey: ForeignKey): string {
    this.validateForeignKey(foreignKey);

    const referenceSql = `${this.referencesStatement} ${foreignKey.referenceTable}(${foreignKey.referenceTableColumn})`;
    const onUpdateConstraint = this.getConstraint(
      this.onUpdateStatement,
      foreignKey.onUpdate,
    );
    const onDeleteConstraint = this.getConstraint(
      this.onDeleteStatement,
      foreignKey.onUpdate,
    );

    return `${this.alterTableStatement} ${foreignKey.table} ${this.addConstraintStatement} ${foreignKey.foreignKeyName} ${this.foreignKeyStatement} (${foreignKey.tableColumn}) ${referenceSql} ${onUpdateConstraint} ${onDeleteConstraint}`;
  }

  getDropForeignKeySql(tableName: string, foreignKeyName: string): string {
    if (!foreignKeyName || !tableName) {
      throw new WrongForeignKeyQuery(
        'foreignKeyName and tableName can not be empty in drop foreign key query',
      );
    }

    return `${this.alterTableStatement} ${tableName} ${this.dropConstrainStatement} ${foreignKeyName}`;
  }
}

export default BaseForeignKeyBuilder;
