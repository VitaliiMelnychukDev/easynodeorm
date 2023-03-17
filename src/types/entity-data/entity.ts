import { ColumnData, ColumnsData } from './column';
import { EntityValidations, PropertyValidations } from './validation';
import { PropertyClassType } from '../object';
import { AllowedPropertiesTypes } from '../global';
import { getRelatedEntity, IntermediateTable, RelationType } from './relations';

export class EntityData {
  validations: EntityValidations = new Map<string, PropertyValidations>();

  tableName: string;

  columns: string[] = [];

  columnsData: ColumnsData = new Map<string, ColumnData>();

  primaryColumns: string[] = [];

  autoIncrementedColumn?: string;

  relations: Record<string, EntityRelation> = {};
}

export type EntityRelation = {
  relationType: RelationType;
  getRelatedEntity: getRelatedEntity;
  field?: string;
  relatedEntityField?: string;
  intermediateTable?: IntermediateTable;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type EntityDataStoreKey = PropertyClassType<unknown> | Function;

export type EntityDataStore = Map<EntityDataStoreKey, EntityData>;

export type PreparedColumnsData = {
  name: string;
  value: AllowedPropertiesTypes;
};

export type PreparedEntityData = {
  tableName: string;
  columns: PreparedColumnsData[];
};

export type EntityTableAndColumns = Pick<
  EntityData,
  'tableName' | 'columns' | 'columnsData' | 'primaryColumns'
>;
