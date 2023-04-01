class FileHelper {
  public static getProjectDefaultDataLoaderPath(): string {
    return `${process.cwd()}\\dataSourceOptions.js`;
  }
}

export default FileHelper;
