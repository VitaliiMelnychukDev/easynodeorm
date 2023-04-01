class FileHelper {
  public static getProjectDefaultDataLoaderPath(): string {
    return `${process.cwd()}\\dataSource.ts`;
  }
}

export default FileHelper;
