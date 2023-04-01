class WrongDataSource extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongDataSource';
  }
}

export default WrongDataSource;
