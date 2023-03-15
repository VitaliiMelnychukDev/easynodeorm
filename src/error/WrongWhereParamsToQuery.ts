class WrongWhereParamsToQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongWhereParamsToQuery';
  }
}

export default WrongWhereParamsToQuery;
