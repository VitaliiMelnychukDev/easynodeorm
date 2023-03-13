class WrongDeleteQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongDeleteQuery';
  }
}

export default WrongDeleteQuery;
