class WrongEntityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongEntityError';
  }
}

export default WrongEntityError;
