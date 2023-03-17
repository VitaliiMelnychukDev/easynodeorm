class ObjectHelper {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static propertyIsDefined(object: Object, propertyKey: string): boolean {
    return !(
      object[propertyKey] === null ||
      object[propertyKey] === undefined ||
      object[propertyKey] === ''
    );
  }
}

export default ObjectHelper;
