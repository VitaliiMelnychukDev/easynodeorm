export type ObjectType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor: Function;
};

export type ObjectWithTheSamePropertyTypes<PropertyType> = {
  [key in string]?: PropertyType;
};

export type ObjectWithPropertyTypesStringArray = ObjectWithTheSamePropertyTypes<
  string[]
>;

export type PropertyClassType<TClass> = { new (): TClass };

export type PropertyKeyTypes = string | symbol | number;
