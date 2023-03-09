export type ObjectWithTheSamePropertyTypes<T> = {
  [key in string]: T;
};

export type ObjectWithPropertyTypesStringArray = ObjectWithTheSamePropertyTypes<
  string[]
>;
