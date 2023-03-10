import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';

class TypeHelper {
  public static createTypeQuery(name: string, enumValues: string[]): string {
    return `CREATE TYPE ${name} AS ENUM ${QueryBuilderHelper.getEnumValuesQuery(
      enumValues,
    )}`;
  }
}

export default TypeHelper;
