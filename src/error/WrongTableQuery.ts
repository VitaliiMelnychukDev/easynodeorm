class WrongTableQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongCreateQuery';
  }
}

export default WrongTableQuery;
