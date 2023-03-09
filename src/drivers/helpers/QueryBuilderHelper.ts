import WrongQuery from '../../error/WrongQuery';
import { AllowedTypes, AllowedTypesToInsert } from '../../types/global';
import { wrongQueryMessage } from '../consts/messages';

class QueryBuilderHelper {
  public static wrapValue(value: string, wrapper: string): string {
    return `${wrapper}${value}${wrapper}`;
  }

  public static prepareValueBeforeInsert(
    value: AllowedTypes,
    wrapper: string,
  ): AllowedTypesToInsert {
    switch (typeof value) {
      case 'number':
        return value as number;
      case 'string':
        return QueryBuilderHelper.wrapValue(value as string, wrapper);
      case 'boolean':
        return value ? 'true' : 'false';
      case 'object':
        if (value === null) return 'null';

        throw new WrongQuery(wrongQueryMessage);
      case undefined:
        return 'null';
      default:
        throw new WrongQuery(wrongQueryMessage);
    }
  }
}

export default QueryBuilderHelper;
