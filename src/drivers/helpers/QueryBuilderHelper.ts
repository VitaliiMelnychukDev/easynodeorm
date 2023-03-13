import WrongQuery from '../../error/WrongQuery';
import { AllowedTypes, AllowedTypesToMakeQueryWith } from '../../types/global';
import { wrongQueryMessage } from '../consts/messages';
import { escape } from 'sqlstring';

class QueryBuilderHelper {
  public static prepareValue(value: AllowedTypes): AllowedTypesToMakeQueryWith {
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
  public static getEnumValuesQuery(enumValues: string[] | number[]): string {
    return `(${enumValues.map((enumValue) => `'${enumValue}'`).join(',')})`;
  }
}

export default QueryBuilderHelper;
