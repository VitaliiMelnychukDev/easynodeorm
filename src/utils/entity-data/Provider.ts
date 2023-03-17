import { ObjectType, PropertyClassType } from '../../types/object';
import {
  PreparedColumnsData,
  EntityData,
  EntityRelation,
  EntityTableAndColumns,
  PreparedEntityData,
} from '../../types/entity-data/entity';
import { EntityDataStore } from './index';
import { ColumnData } from '../../types/entity-data/column';
import { QueryOperation } from '../../types/entity-data/validation';

class Provider {
  private readonly entity: ObjectType;
  private readonly entityData: EntityData;

  constructor(
    entityClass: PropertyClassType<unknown>,
    entity: ObjectType = {},
  ) {
    this.entityData = EntityDataStore.getEntityDataOrThrowError(
      entityClass,
      entity.constructor.name,
    );
    this.entity = entity;
  }

  getEntityData(operation: QueryOperation): PreparedEntityData {
    return {
      tableName: this.entityData.tableName,
      columns: this.getColumns(operation),
    };
  }

  getPreparedColumns(columns: string[]): PreparedColumnsData[] {
    return this.prepareColumns(columns);
  }

  getC;

  getRelationsData(): Record<string, EntityRelation> {
    return this.entityData.relations;
  }

  getTableAndColumnsData(): EntityTableAndColumns {
    return {
      tableName: this.entityData.tableName,
      columns: this.entityData.columns,
      columnsData: this.entityData.columnsData,
      primaryColumns: this.entityData.primaryColumns,
    };
  }

  private getColumns(operation: QueryOperation): PreparedColumnsData[] {
    const columnsToSet: string[] = [...this.entityData.columns];

    if (operation === QueryOperation.Insert) {
      this.entityData.primaryColumns.forEach((primaryColumn: string) => {
        if (this.entityData.autoIncrementedColumn !== primaryColumn) {
          columnsToSet.push(primaryColumn);
        }
      });
    }

    return this.prepareColumns(columnsToSet);
  }

  private prepareColumns(columnsList: string[]): PreparedColumnsData[] {
    return columnsList.map((column: string) => {
      const columnData = this.entityData.columnsData.get(column);

      return {
        name: Provider.getTableColumnKey(column, columnData),
        value:
          this.entity[column] !== undefined
            ? this.entity[column]
            : columnData && columnData.defaultValue,
      };
    });
  }

  public static getTableColumnKey(
    entityColumn: string,
    columnData: ColumnData | null,
  ): string {
    return (columnData && columnData.customName?.columnName) || entityColumn;
  }

  public static getEntityColumns(entityData: EntityData): string[] {
    return [...entityData.columns, ...entityData.primaryColumns];
  }
}

export default Provider;
