export type QueryResult<T> = {
  command: string;
  rowCount: number;
  rows: T[];
};
