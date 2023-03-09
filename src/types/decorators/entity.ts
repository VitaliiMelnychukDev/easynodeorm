import { ColumnData, ColumnsData } from './column';
import { EntityValidations, PropertyValidations } from './validation';

export class EntityData {
  validations: EntityValidations = new Map<string, PropertyValidations>();

  tableName?: string;

  columns: string[] = [];

  columnsData: ColumnsData = new Map<string, ColumnData>();

  primaryColumns: string[] = [];

  autoIncrementColumn?: string;
}

export type ColumnDataToHandel = {
  name: string;
  value: string | boolean | number;
};

export type EntityDataToHandle = {
  tableName: string;
  columns: ColumnDataToHandel[];
};
