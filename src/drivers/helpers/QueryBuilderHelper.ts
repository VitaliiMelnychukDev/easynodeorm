import WrongQuery from '../../error/WrongQuery';
import { AllowedTypes, AllowedTypesToInsert } from '../../types/global';
import { wrongQueryMessage } from '../consts/messages';
import { escape } from 'sqlstring';

class QueryBuilderHelper {
  public static wrapValue(value: string, wrapper: string): string {
    return `${wrapper}${value}${wrapper}`;
  }

  public static prepareValueBeforeInsert(
    value: AllowedTypes,
  ): AllowedTypesToInsert {
    switch (typeof value) {
      case 'number':
        return Number(value);
      case 'string':
        return escape(value);
      case 'boolean':
        return value ? 'true' : 'false';
      case 'object':
        if (value === null) return 'NULL';

        throw new WrongQuery(wrongQueryMessage);
      case undefined:
        return 'null';
      default:
        throw new WrongQuery(wrongQueryMessage);
    }
  }
}

export default QueryBuilderHelper;
