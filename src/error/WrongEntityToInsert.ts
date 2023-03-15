class WrongEntityToInsert extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongEntityToInsert';
  }
}

export default WrongEntityToInsert;
