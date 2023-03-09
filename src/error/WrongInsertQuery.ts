class WrongInsertQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongInsertQuery';
  }
}

export default WrongInsertQuery;
