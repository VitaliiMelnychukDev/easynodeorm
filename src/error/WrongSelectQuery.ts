class WrongSelectQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongSelectQuery';
  }
}

export default WrongSelectQuery;
