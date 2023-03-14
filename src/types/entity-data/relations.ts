import { PropertyClassType } from '../object';

export type getRelatedEntity = () => PropertyClassType<unknown>;

export type OneToOneProps = {
  relatedField: string;
  getRelatedEntity: getRelatedEntity;
  fieldLocation?: EntityRelationFieldLocation;
};

export type OneToManyProps = {
  getRelatedEntity: getRelatedEntity;
  relatedEntityField: string;
};

export type ManyToOneProps = {
  relatedField: string;
  getRelatedEntity: getRelatedEntity;
};

export type ManyToManyProps = {
  getRelatedEntity: getRelatedEntity;
  intermediateTable: IntermediateTable;
};

export type IntermediateTable = {
  name: string;
  fieldNames: {
    currentEntity: string;
    relatedEntity: string;
  };
};

export enum RelationType {
  OneToOne = 'OneToOne',
  OneToMany = 'OneToMany',
  ManyToOne = 'ManyToOne',
  ManyToMany = 'ManyToMany',
}

export const enum EntityRelationFieldLocation {
  'CurrentEntity' = 'CurrentEntity',
  'RelatedEntity' = 'RelatedEntity',
}
