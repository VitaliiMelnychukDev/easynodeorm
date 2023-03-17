import { ForeignKey, ForeignKeyAction } from '../types/foreignKey';
import WrongForeignKeyQuery from '../../error/WrongForeignKeyQuery';
import ForeignKeyBuilder from '../types/builders/ForeignKeyBuilder';

class BaseForeignKeyBuilder implements ForeignKeyBuilder {
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

    const referenceSql = `REFERENCES ${foreignKey.referenceTable}(${foreignKey.referenceTableColumn})`;
    const onUpdateConstraint = this.getConstraint(
      'ON UPDATE',
      foreignKey.onUpdate,
    );
    const onDeleteConstraint = this.getConstraint(
      'ON DELETE',
      foreignKey.onUpdate,
    );

    return `ALTER TABLE ${foreignKey.table} ADD CONSTRAINT ${foreignKey.foreignKeyName} FOREIGN KEY (${foreignKey.tableColumn}) ${referenceSql} ${onUpdateConstraint} ${onDeleteConstraint}`;
  }

  getDropForeignKeySql(tableName: string, foreignKeyName: string): string {
    if (!foreignKeyName || !tableName) {
      throw new WrongForeignKeyQuery(
        'foreignKeyName and tableName can not be empty in drop foreign key query',
      );
    }

    return `ALTER TABLE ${tableName} DROP CONSTRAINT ${foreignKeyName}`;
  }
}

export default BaseForeignKeyBuilder;
