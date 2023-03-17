class WrongForeignKeyQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongForeignKeyQuery';
  }
}

export default WrongForeignKeyQuery;
