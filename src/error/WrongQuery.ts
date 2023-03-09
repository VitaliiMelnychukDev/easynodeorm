class WrongQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongQuery';
  }
}

export default WrongQuery;
