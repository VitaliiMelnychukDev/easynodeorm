export type ObjectType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor: Function;
};

export type ObjectWithTheSamePropertyTypes<T> = {
  [key in string]?: T;
};

export type ObjectWithPropertyTypesStringArray = ObjectWithTheSamePropertyTypes<
  string[]
>;

export type PropertyClassType<TClass> = { new (): TClass };
