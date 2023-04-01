import DataManipulationQueryManager from './DataManipulationQueryManager';
import { PropertyClassType } from '../types/object';
import { UpdateEntity, Where, WithRelations } from './types';
import InsertEntityHelper from './utils/entity/InsertEntityHelper';
import DeleteEntityHelper from './utils/entity/DeleteEntityHelper';
import SelectEntityHelper from './utils/entity/SelectEntityHelper';
import UpdateEntityHelper from './utils/entity/UpdateEntityHelper';

class BaseRepository<Entity> {
  protected readonly queryManager: DataManipulationQueryManager;

  protected readonly entityClass: PropertyClassType<Entity>;

  protected readonly insertEntityHelper: InsertEntityHelper;

  protected readonly deleteEntityHelper: DeleteEntityHelper;

  protected readonly selectEntityHelper: SelectEntityHelper;

  protected readonly updateEntityHelper: UpdateEntityHelper;

  constructor(
    queryManager: DataManipulationQueryManager,
    entityClass: PropertyClassType<Entity>,
  ) {
    this.queryManager = queryManager;
    this.entityClass = entityClass;
    this.insertEntityHelper = new InsertEntityHelper(this.queryManager);
    this.deleteEntityHelper = new DeleteEntityHelper(this.queryManager);
    this.selectEntityHelper = new SelectEntityHelper(this.queryManager);
    this.updateEntityHelper = new UpdateEntityHelper(
      this.queryManager,
      this.insertEntityHelper,
      this.selectEntityHelper,
    );
  }
  async create(
    entity: Entity,
    withRelations: WithRelations<Entity>[] = [],
  ): Promise<Entity> {
    return this.insertEntityHelper.create(
      entity,
      withRelations,
      this.entityClass,
    );
  }

  async get(where: Where<keyof Entity>): Promise<Entity[]> {
    return await this.selectEntityHelper.selectByWhere(where, this.entityClass);
  }

  async getOne(where: Where<keyof Entity>): Promise<Entity | null> {
    return await this.selectEntityHelper.getOne(where, this.entityClass);
  }

  async populate(
    entity: Entity,
    withRelations: WithRelations<Entity>[] = [],
  ): Promise<Entity> {
    return await this.selectEntityHelper.populate(
      entity,
      this.entityClass,
      withRelations,
    );
  }

  async updateEntity(
    entity: Entity,
    withRelations: WithRelations<Entity>[] = [],
  ): Promise<Entity> {
    return await this.updateEntityHelper.updateEntity(
      entity,
      this.entityClass,
      withRelations,
    );
  }

  async update(
    updatedFields: UpdateEntity<Entity>,
    where: Where<keyof Entity>,
    returnUpdated = false,
  ): Promise<Entity[]> {
    return await this.updateEntityHelper.update(
      updatedFields,
      this.entityClass,
      where,
      returnUpdated,
    );
  }

  async deleteEntity(entity: Entity): Promise<void> {
    return await this.deleteEntityHelper.deleteEntity(entity, this.entityClass);
  }

  async delete(
    where: Where<keyof Entity>,
    returnDeleted = false,
  ): Promise<Entity[]> {
    return await this.deleteEntityHelper.delete(
      where,
      this.entityClass,
      returnDeleted,
    );
  }
}

export default BaseRepository;
