import { ColumnData, ColumnsData } from './column';
import { EntityValidations, PropertyValidations } from './validation';
import { PropertyClassType } from '../object';
import { AllowedTypes } from '../global';

export class EntityData {
  validations: EntityValidations = new Map<string, PropertyValidations>();

  tableName?: string;

  columns: string[] = [];

  columnsData: ColumnsData = new Map<string, ColumnData>();

  primaryColumns: string[] = [];

  autoIncrementColumn?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type EntityDataStoreKeyType = PropertyClassType<unknown> | Function;

export type EntityDataStoreType = Map<EntityDataStoreKeyType, EntityData>;

export type ColumnDataToHandel = {
  name: string;
  value: AllowedTypes;
};

export type PreparedEntityData = {
  tableName: string;
  columns: ColumnDataToHandel[];
};
