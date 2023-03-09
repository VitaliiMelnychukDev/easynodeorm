import { ObjectType } from '../../types/object';
import {
  ColumnDataToHandel,
  EntityData,
  PreparedEntityData,
} from '../../types/entity-data/entity';
import WrongEntityError from '../../error/WrongEntityError';
import { EntityDataStore } from './index';

class Provider {
  private readonly entity: ObjectType;
  private readonly entityData: EntityData;
  constructor(entity: ObjectType) {
    this.entityData = Provider.getEntityDataOrThrowError(entity);
    this.entity = entity;
  }

  getEntityData(): PreparedEntityData {
    return {
      tableName: this.getTableName(),
      columns: this.getColumns(),
    };
  }
  public static getEntityDataOrThrowError(entity: ObjectType): EntityData {
    const entityData = EntityDataStore.getEntityDataByFunction(
      entity.constructor,
    );

    if (!entityData) {
      throw new WrongEntityError(
        'Entity is not valid. Please set column entity-data',
      );
    }

    return entityData;
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
