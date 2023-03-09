import { ObjectWithPropertyTypesStringArray } from '../types/object';

class WrongPropertyError extends Error {
  details: ObjectWithPropertyTypesStringArray;

  constructor(message: string, details: ObjectWithPropertyTypesStringArray) {
    super(message);
    this.name = 'WrongPropertyError';
    this.details = details;
  }
}
export default WrongPropertyError;
