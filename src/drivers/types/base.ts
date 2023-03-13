export type BaseNameObject = {
  name: string;
  alias?: string;
};

export type RequiredAlias = Required<BaseNameObject>;

export const isRequiredAlias = (table: any): table is RequiredAlias => {
  return (
    typeof table === 'object' &&
    table.alias !== undefined &&
    table.name !== undefined
  );
};
