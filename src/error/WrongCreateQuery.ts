class WrongCreateQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongCreateQuery';
  }
}

export default WrongCreateQuery;
