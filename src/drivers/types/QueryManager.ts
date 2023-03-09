import BaseInsertBuilder from '../base-query-builders/BaseInsertBuilder';

export type QueryMarks = Required<
  Pick<QueryManagerProps, 'propertiesDivider' | 'stringPropertiesQuote'>
>;

export type QueryManagerProps = {
  insertBuilder?: BaseInsertBuilder;
  propertiesDivider?: string;
  stringPropertiesQuote?: string;
};
