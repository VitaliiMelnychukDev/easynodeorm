class WrongIndexQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongIndexQuery';
  }
}

export default WrongIndexQuery;
