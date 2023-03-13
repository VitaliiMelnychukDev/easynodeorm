class WrongIndexQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = message;
  }
}

export default WrongIndexQuery;
