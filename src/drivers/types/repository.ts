export type WithRelations<T> = keyof T | 'all';

export type UpdateEntity<Entity> = {
  [Property in keyof Entity]?: Entity[Property];
};
