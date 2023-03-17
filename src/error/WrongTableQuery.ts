class WrongTableQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongTableQuery';
  }
}

export default WrongTableQuery;
