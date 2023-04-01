import { Where, WithRelations } from './types';
import InsertEntityHelper from './utils/entity/InsertEntityHelper';
import DataManipulationQueryManager from './DataManipulationQueryManager';
import DeleteEntityHelper from './utils/entity/DeleteEntityHelper';
import SelectEntityHelper from './utils/entity/SelectEntityHelper';
import UpdateEntityHelper from './utils/entity/UpdateEntityHelper';

abstract class BaseModel {
  protected readonly queryManager: DataManipulationQueryManager;

  protected readonly insertEntityHelper: InsertEntityHelper;

  protected readonly deleteEntityHelper: DeleteEntityHelper;

  protected readonly selectEntityHelper: SelectEntityHelper;

  protected readonly updateEntityHelper: UpdateEntityHelper;
  protected constructor(queryManager: DataManipulationQueryManager) {
    this.queryManager = queryManager;
    this.insertEntityHelper = new InsertEntityHelper(this.queryManager);
    this.deleteEntityHelper = new DeleteEntityHelper(this.queryManager);
    this.selectEntityHelper = new SelectEntityHelper(this.queryManager);
    this.updateEntityHelper = new UpdateEntityHelper(
      this.queryManager,
      this.insertEntityHelper,
      this.selectEntityHelper,
    );
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

  async get(where: Where<keyof this>): Promise<this | null> {
    return await this.selectEntityHelper.getOne(where, this.constructor);
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
