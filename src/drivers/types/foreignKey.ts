export const enum ForeignKeyAction {
  Restrict = 'restrict',
  SetNull = 'setNull',
  SetDefault = 'setDefault',
  NoAction = 'noAction',
  Cascade = 'cascade',
}

export type ForeignKey = {
  table: string;
  tableColumn: string;
  referenceTable: string;
  referenceTableColumn: string;
  foreignKeyName: string;
  onUpdate?: ForeignKeyAction;
  onDelete?: ForeignKeyAction;
};
