class WrongWhereParamsQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongWhereParamsQuery';
  }
}

export default WrongWhereParamsQuery;
