import { Table } from './table';

export enum JoinVariant {
  Left = 'left',
  Inner = 'inner',
  Right = 'right',
  FullOuter = 'fullOuter',
}

export type Join = {
  type: JoinVariant;
  table: Table;
  on: {
    column: string;
    joinTableColumn: string;
  };
};
