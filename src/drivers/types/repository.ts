export type WithRelations<Entity> = keyof Entity | 'all';

export type UpdateEntity<Entity> = {
  [Property in keyof Entity]?: Entity[Property];
};
