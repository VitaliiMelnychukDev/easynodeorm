export type BaseNameObject = {
  name: string;
  alias?: string;
};

export type RequiredAlias = Required<BaseNameObject>;

export const isRequiredAlias = (obj: any): obj is RequiredAlias => {
  return (
    typeof obj === 'object' &&
    obj &&
    obj.alias !== undefined &&
    obj.name !== undefined
  );
};
