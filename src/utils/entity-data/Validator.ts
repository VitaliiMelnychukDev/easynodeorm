import {
  EntityData,
  EntityDataStoreKey,
  EntityRelation,
} from '../../types/entity-data/entity';
import WrongEntityError from '../../error/WrongEntityError';
import WrongPropertyError from '../../error/WrongPropertyError';
import ObjectHelper from '../../helpers/ObjectHelper';
import {
  isDecoratorData,
  QueryOperation,
} from '../../types/entity-data/validation';
import { MessageCode } from '../../consts/message';
import {
  ObjectType,
  ObjectWithPropertyTypesStringArray,
} from '../../types/object';
import { EntityDataStore } from './index';
import { RelationType } from '../../types/entity-data/relations';

class Validator {
  private readonly entity: ObjectType;
  private readonly entityData: EntityData;
  private readonly entityClassName: string;
  private validateOperation: QueryOperation = QueryOperation.Insert;
  private propertyValidationErrors: ObjectWithPropertyTypesStringArray = {};

  constructor(entityClass: EntityDataStoreKey, entity: ObjectType = {}) {
    this.entityData = EntityDataStore.getEntityDataOrThrowError(
      entityClass,
      entity.constructor.name,
    );
    this.entity = entity;
    this.entityClassName = entity.constructor.name;
  }

  public validate(validateOperation = QueryOperation.Insert): void {
    this.validateOperation = validateOperation;
    this.validateTableName();
    this.validateAutoIncrement();
    this.validatePrimaryColumn();
    this.validateColumns();
    this.validaRelations();
    this.validateEntityValues();
  }

  public validateProperties(columnNames: string[]): void {
    this.propertyValidationErrors = {};
    this.validateOperation = QueryOperation.Update;
    columnNames.forEach((columnName) => {
      if (this.entityData.columns.includes(columnName)) {
        this.analyzePropertyColumnsData(columnName);
        this.handlePropertyValidations(columnName);
      } else if (this.entityData.primaryColumns.includes(columnName)) {
        this.validatePrimaryKeyProperty(columnName);
      } else {
        this.addPropertyErrors(columnName, [
          `Entity does not contain column ${columnName}.`,
        ]);
      }
    });

    this.checkAndThrowWrongPropertyError();
  }

  public validateTableAndColumnsData(): void {
    this.validateTableName();
    this.validateAutoIncrement();
    this.validatePrimaryColumn();
    this.validateColumns();
  }

  private validateTableName(): void {
    if (!this.entityData.tableName) {
      throw new WrongEntityError(
        'Wrong entity-data table name. Each entity should specify table name using Entity decorator',
      );
    }
  }

  public validaRelations(): void {
    const relationKeys = Object.keys(this.entityData.relations);

    relationKeys.forEach((relationKey) => {
      const relation = this.entityData.relations[relationKey];

      if (relation.relationType !== RelationType.ManyToMany) {
        this.validateCommonRelationType(relation, relationKey);
      } else {
        this.validateManyToManyRelation(relation, relationKey);
      }
    });
  }

  private validateCommonRelationType(
    entityRelation: EntityRelation,
    relationKey: string,
  ): void {
    if (!entityRelation.field || !entityRelation.relatedEntityField) {
      throw new WrongEntityError(
        `${this.getEntityDefaultError(
          entityRelation.relationType,
          relationKey,
        )} field and relatedEntityField can not be empty.`,
      );
    }

    this.validateRelationColumnExists(
      this.entityData,
      entityRelation.field,
      entityRelation.relationType,
      relationKey,
    );

    const relationEntity = EntityDataStore.getEntityDataByFunction(
      entityRelation.getRelatedEntity(),
    );

    if (!relationEntity) {
      throw new WrongEntityError(
        `${this.getEntityDefaultError(
          entityRelation.relationType,
          relationKey,
        )} relation entity is not valid entity.`,
      );
    }

    this.validateRelationColumnExists(
      relationEntity,
      entityRelation.relatedEntityField,
      entityRelation.relationType,
      relationKey,
    );
  }

  private validateManyToManyRelation(
    entityRelation: EntityRelation,
    relationKey: string,
  ): void {
    if (!entityRelation.intermediateTable) {
      throw new WrongEntityError(
        `${this.getEntityDefaultError(
          entityRelation.relationType,
          relationKey,
        )} intermediateTable field can not be empty`,
      );
    }

    this.validateRelationColumnExists(
      this.entityData,
      entityRelation.intermediateTable.fieldNames.currentEntityField,
      entityRelation.relationType,
      relationKey,
    );

    const relationEntity = EntityDataStore.getEntityDataByFunction(
      entityRelation.getRelatedEntity(),
    );

    if (!relationEntity) {
      throw new WrongEntityError(
        `${this.getEntityDefaultError(
          entityRelation.relationType,
          relationKey,
        )} relation entity is not valid.`,
      );
    }

    this.validateRelationColumnExists(
      relationEntity,
      entityRelation.intermediateTable.fieldNames.relatedEntityField,
      entityRelation.relationType,
      relationKey,
    );
  }

  private validateRelationColumnExists(
    entity: EntityData,
    columnToCheck: string,
    relationType: RelationType,
    relationKey: string,
  ): void {
    if (
      !entity.primaryColumns.includes(columnToCheck) &&
      !entity.columns.includes(columnToCheck)
    ) {
      throw new WrongEntityError(
        `${this.getEntityDefaultError(
          relationType,
          relationKey,
        )} related entity should contain ${columnToCheck} field.`,
      );
    }
  }

  private getEntityDefaultError(
    relationType: RelationType,
    relationKey: string,
  ): string {
    return `${this.entityClassName} ${relationType} relation from field ${relationKey} error: `;
  }

  private validateEntityValues(): void {
    this.propertyValidationErrors = {};
    this.validatePrimaryKeyProperties();
    this.validatePropertyValues();

    this.checkAndThrowWrongPropertyError();
  }

  private checkAndThrowWrongPropertyError(): void {
    if (Object.keys(this.propertyValidationErrors).length > 0) {
      throw new WrongPropertyError(
        'Wrong entity-data properties values',
        this.propertyValidationErrors,
      );
    }
  }

  private validateAutoIncrement(): void {
    if (!this.entityData.autoIncrementedColumn) return;

    if (
      !this.entityData.primaryColumns.includes(
        this.entityData.autoIncrementedColumn,
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
    if (this.entityData.columns.length === 0) {
      throw new WrongEntityError(
        `Entity ${this.entityClassName} should have at least one not primary auto incremented column`,
      );
    }
  }

  private validatePrimaryKeyProperties(): void {
    this.entityData.primaryColumns.forEach((primaryColumn: string) => {
      this.validatePrimaryKeyProperty(primaryColumn);
    });
  }

  private validatePrimaryKeyProperty(primaryColumn: string): void {
    if (
      (primaryColumn !== this.entityData.autoIncrementedColumn ||
        (primaryColumn === this.entityData.autoIncrementedColumn &&
          this.validateOperation === QueryOperation.Update)) &&
      !ObjectHelper.propertyIsDefined(this.entity, primaryColumn)
    ) {
      this.addPropertyErrors(primaryColumn, [`Primary key should be defined`]);
    }
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
