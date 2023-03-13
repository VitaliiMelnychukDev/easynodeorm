class WrongForeignKeyQuery extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongForeignQuery';
  }
}

export default WrongForeignKeyQuery;
