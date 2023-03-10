class WrongQueryResult extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongQueryResult';
  }
}

export default WrongQueryResult;
