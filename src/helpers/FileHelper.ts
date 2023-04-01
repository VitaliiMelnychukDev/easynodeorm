class FileHelper {
  public static getProjectDefaultDataLoaderPath(): string {
    return `${process.cwd()}\\dataSource.js`;
  }
}

export default FileHelper;
