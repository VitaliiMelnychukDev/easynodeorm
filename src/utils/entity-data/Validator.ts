import { EntityData } from '../../types/entity-data/entity';
import WrongEntityError from '../../error/WrongEntityError';
import WrongPropertyError from '../../error/WrongPropertyError';
import ObjectHelper from '../../helpers/ObjectHelper';
import { isDecoratorData } from '../../types/entity-data/validation';
import { MessageCode } from '../../consts/message';
import {
  ObjectType,
  ObjectWithPropertyTypesStringArray,
} from '../../types/object';
import { EntityDataStore } from './index';

class Validator {
  private readonly entity: ObjectType;
  private readonly entityData: EntityData;
  private readonly entityClassName: string;
  private readonly propertyValidationErrors: ObjectWithPropertyTypesStringArray =
    {};
  constructor(entity: ObjectType) {
    this.entityData = EntityDataStore.getEntityDataOrThrowError(entity);
    this.entity = entity;
    this.entityClassName = entity.constructor.name;
  }

  public validate(): void {
    this.validateAutoIncrement();
    this.validatePrimaryColumn();
    this.validateColumns();
    this.validateEntityValues();
  }

  private validateEntityValues(): void {
    this.validatePrimaryKeyProperty();
    this.validatePropertyValues();
    if (Object.keys(this.propertyValidationErrors).length > 0) {
      throw new WrongPropertyError(
        'Wrong entity-data-data properties',
        this.propertyValidationErrors,
      );
    }
  }

  private validateAutoIncrement(): void {
    if (!this.entityData.autoIncrementColumn) return;

    if (
      !this.entityData.primaryColumns.includes(
        this.entityData.autoIncrementColumn,
      ) ||
      this.entityData.primaryColumns.length !== 1
    ) {
      throw new WrongEntityError(
        `Entity ${this.entityClassName} could have only one auto incremented column. 
        Count primary columns should be the same as count auto incremented columns`,
      );
    }
  }

  private validatePrimaryColumn(): void {
    if (this.entityData.primaryColumns.length === 0) {
      throw new WrongEntityError(
        `Entity ${this.entityClassName} should have at least on primary column`,
      );
    }
  }

  private validateColumns(): void {
    if (
      this.entityData.columns.length === 0 ||
      (this.entityData.columns.length === 1 &&
        this.entityData.autoIncrementColumn ===
          this.entityData.primaryColumns[0])
    ) {
      throw new WrongEntityError(
        `Entity ${this.entityClassName} should have at least one not primary auto incremented column`,
      );
    }
  }

  private validatePrimaryKeyProperty(): void {
    this.entityData.primaryColumns.forEach((primaryColumn: string) => {
      if (
        primaryColumn !== this.entityData.autoIncrementColumn &&
        !ObjectHelper.propertyIsDefined(this.entity, primaryColumn)
      ) {
        this.addPropertyErrors(primaryColumn, [
          `Not auto incremented primary keys should be defined`,
        ]);
      }
    });
  }

  private validatePropertyValues(): void {
    this.entityData.columns.forEach((columnName: string) => {
      this.analyzePropertyColumnsData(columnName);
      this.handlePropertyValidations(columnName);
    });
  }

  private analyzePropertyColumnsData(columnName: string): void {
    if (
      !this.defaultValueExists(columnName) &&
      !ObjectHelper.propertyIsDefined(this.entity, columnName)
    ) {
      this.addPropertyErrors(columnName, [`Column ${columnName} is required`]);
    }
  }
  private handlePropertyValidations(columnName: string): void {
    const propertyValidations = this.entityData.validations.get(columnName);
    const defaultColumnValueExists = this.defaultValueExists(columnName);
    const columnValue = this.entity[columnName];
    const errors: string[] = [];

    for (const validationData in propertyValidations) {
      if (!defaultColumnValueExists || columnValue !== undefined) {
        const validator = propertyValidations[validationData];

        const error = isDecoratorData(validator)
          ? validator.method.call(null, {
              value: columnValue,
              propertyKey: columnName,
              props: validator.props,
            })
          : validator.method.call(null, {
              value: columnValue,
              propertyKey: columnName,
            });

        if (error) errors.push(error);
      }
    }

    if (errors.length) {
      this.addPropertyErrors(columnName, errors);
    }
  }

  private addPropertyErrors(propertyKey: string, errors: string[]): void {
    if (!this.propertyValidationErrors[propertyKey]) {
      this.propertyValidationErrors[propertyKey] = [];
    }

    errors.forEach((error) => {
      const errorMessage = this.getErrorMessage(error);
      if (!this.propertyValidationErrors[propertyKey].includes(errorMessage)) {
        this.propertyValidationErrors[propertyKey].push(errorMessage);
      }
    });
  }

  private getErrorMessage(error: MessageCode | string): string {
    switch (error) {
      case MessageCode.NotValidPropertyType:
        return 'Property type is not valid.';
      default:
        return error;
    }
  }

  private defaultValueExists(columnName: string): boolean {
    const columnsData = this.entityData.columnsData.get(columnName);

    return !!(columnsData && columnsData.defaultValue !== undefined);
  }
}

export default Validator;
