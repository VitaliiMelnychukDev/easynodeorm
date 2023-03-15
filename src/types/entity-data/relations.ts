import { PropertyClassType } from '../object';

export type getRelatedEntity = () => PropertyClassType<unknown>;

type CommonRelationFields = {
  field: string;
  relatedEntityField: string;
  getRelatedEntity: getRelatedEntity;
};

export type OneToOneProps = CommonRelationFields;

export type OneToManyProps = CommonRelationFields;

export type ManyToOneProps = CommonRelationFields;

export type ManyToManyProps = Pick<CommonRelationFields, 'getRelatedEntity'> & {
  intermediateTable: IntermediateTable;
};

export type IntermediateTable = {
  name: string;
  fieldNames: {
    currentEntityField: string;
    currentTableIntermediateField: string;
    relatedEntityField: string;
    relatedTableIntermediateField: string;
  };
};

export enum RelationType {
  OneToOne = 'OneToOne',
  OneToMany = 'OneToMany',
  ManyToOne = 'ManyToOne',
  ManyToMany = 'ManyToMany',
}
