export const enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderBy = {
  column: string;

  order?: Order;
};
