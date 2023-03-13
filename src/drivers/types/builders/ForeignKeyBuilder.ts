import { ForeignKey } from '../foreignKey';

interface ForeignKeyBuilder {
  getCreateForeignKeySql(foreignKey: ForeignKey): string;
  getDropForeignKeySql(tableName: string, foreignKeyName: string): string;
}

export default ForeignKeyBuilder;
