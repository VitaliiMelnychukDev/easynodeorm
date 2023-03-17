export type QueryResult<Row> = {
  command: string;
  rowCount: number;
  rows: Row[];
};
