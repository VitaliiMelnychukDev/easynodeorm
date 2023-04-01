import { Where, WithRelations } from './types';
import InsertEntityHelper from './utils/entity/InsertEntityHelper';
import DataManipulationQueryManager from './DataManipulationQueryManager';
import DeleteEntityHelper from './utils/entity/DeleteEntityHelper';
import SelectEntityHelper from './utils/entity/SelectEntityHelper';
import UpdateEntityHelper from './utils/entity/UpdateEntityHelper';
import FileHelper from '../helpers/FileHelper';
import WrongDataSource from '../error/WrongDataSource';
import DataSource from '../data-source/DataSource';

abstract class BaseModel {
  protected readonly queryManager: DataManipulationQueryManager;

  protected readonly insertEntityHelper: InsertEntityHelper;

  protected readonly deleteEntityHelper: DeleteEntityHelper;

  protected readonly selectEntityHelper: SelectEntityHelper;

  protected readonly updateEntityHelper: UpdateEntityHelper;
  constructor() {
    this.queryManager = BaseModel.getQueryManager();
    this.insertEntityHelper = new InsertEntityHelper(this.queryManager);
    this.deleteEntityHelper = new DeleteEntityHelper(this.queryManager);
    this.selectEntityHelper = new SelectEntityHelper(this.queryManager);
    this.updateEntityHelper = new UpdateEntityHelper(
      this.queryManager,
      this.insertEntityHelper,
      this.selectEntityHelper,
    );
    BaseModel.getQueryManager();
  }

  private static getQueryManager(): DataManipulationQueryManager {
    const path = FileHelper.getProjectDefaultDataLoaderPath();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dataSourceFile = require(path);
    if (!dataSourceFile || !dataSourceFile.options) {
      throw new WrongDataSource(
        'Please create valid dataSource.ts at your root folder to create models',
      );
    }

    try {
      const dataSource = DataSource.getDataSource(dataSourceFile.options);

      return dataSource.queryManager;
    } catch {
      throw new WrongDataSource(
        'Data Source creation error. Please set up valid dataSource.js at your root folder',
      );
    }
  }

  private static getSelectEntityHelper(): SelectEntityHelper {
    const queryManager = BaseModel.getQueryManager();

    return new SelectEntityHelper(queryManager);
  }
  async create(withRelations: WithRelations<this>[] = []): Promise<this> {
    return await this.insertEntityHelper.create(
      this,
      withRelations,
      this.constructor,
    );
  }

  async delete(): Promise<void> {
    return await this.deleteEntityHelper.deleteEntity(this, this.constructor);
  }

  public static async getOne<Entity>(
    where: Where<keyof Entity>,
  ): Promise<Entity | null> {
    return await BaseModel.getSelectEntityHelper().getOne(where, this);
  }

  async populate(withRelations: WithRelations<this>[] = []): Promise<this> {
    return await this.selectEntityHelper.populate(
      this,
      this.constructor,
      withRelations,
    );
  }

  async update(withRelations: WithRelations<this>[] = []): Promise<this> {
    return await this.updateEntityHelper.updateEntity(
      this,
      this.constructor,
      withRelations,
    );
  }
}

export default BaseModel;
