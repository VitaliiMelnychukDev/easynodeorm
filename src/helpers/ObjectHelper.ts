class ObjectHelper {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static propertyIsDefined(object: Object, propertyKey: string): boolean {
    if (
      object[propertyKey] === null ||
      object[propertyKey] === undefined ||
      object[propertyKey] === ''
    ) {
      return false;
    }

    return true;
  }
}

export default ObjectHelper;
