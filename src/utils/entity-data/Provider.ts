import { ObjectType, PropertyClassType } from '../../types/object';
import {
  ColumnDataToHandel,
  EntityData,
  EntityRelation,
  PreparedEntityData,
} from '../../types/entity-data/entity';
import { EntityDataStore } from './index';

class Provider {
  private readonly entity: ObjectType;
  private readonly entityData: EntityData;
  constructor(entity: ObjectType, entityClass: PropertyClassType<unknown>) {
    this.entityData = EntityDataStore.getEntityDataOrThrowError(
      entityClass,
      entity.constructor.name,
    );
    this.entity = entity;
  }

  getEntityData(): PreparedEntityData {
    return {
      tableName: this.getTableName(),
      columns: this.getColumns(),
    };
  }

  getRelationsData(): Record<string, EntityRelation> {
    return this.entityData.relations;
  }

  private getTableName(): string {
    return (
      this.entityData.tableName || this.entity.constructor.name.toLowerCase()
    );
  }
  private getColumns(): ColumnDataToHandel[] {
    const columnsToSet: string[] = [...this.entityData.columns];
    this.entityData.primaryColumns.forEach((primaryColumn: string) => {
      if (this.entityData.autoIncrementColumn !== primaryColumn) {
        columnsToSet.push(primaryColumn);
      }
    });

    return columnsToSet.map((column: string) => {
      const columnData = this.entityData.columnsData.get(column);

      return {
        name: (columnData && columnData.customName?.columnName) || column,
        value:
          this.entity[column] !== undefined
            ? this.entity[column]
            : columnData && columnData.defaultValue,
      };
    });
  }
}

export default Provider;
