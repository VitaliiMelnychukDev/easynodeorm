**EasyNodeORM** is a TypeScript ORM library. It helps you to connect application to relational database.
**EasyNodeORM** supports **Postgres** and **MySql** at the moment.
**EasyNodeORM** supports both **DataMapper** and **Active Record** patterns.

# Installation

1. Install the npm package:\
    `npm i --save easynodeorm`
2. Install database driver:
   * For MySQL\
   `npm i --save mysql2`
   * For Postgres\
   `npm --save  i pg`

# Documentation
As we talked earlier **EasyNodeORM** supports both **DataMapper** and **Active Record** patterns. In the examples we will look how to work with both patterns.

## Data Source
It is needed to create data source objects to interact with database. Data Source object establish initial pool of connections to database. 
Example of connection options:
```ts
const connectionOptions = {
  name: SupportedDatabaseNames.Postgres,
  host: 'localhost',
  user: 'postgres',
  database: 'easynode',
  password: 'test1234',
  maxConnection: 20, // max count of pool connections
  timeouts: {
    idle: 30000,
    connection: 20000,
  },
}

```
### Data Mapper
You should create data source connection in order to implement **Data Mapper** pattern. Example of data source connection:
```ts
const postgresDataSource =
  DataSource.getDataSource<SupportedDatabaseNames.Postgres>(connectionOptions);
```
You could create several data source connection to different databases if it is needed.
### Active Record
In order to implement Active Record pattern file ```dataSourceOptions.js``` should be created in the root folder of you project.
This file should export connection options.
```js
module.exports.options = {
  name: 'postgres',
  host: 'localhost',
  user: 'postgres',
  database: 'easynode',
  password: 'test1234',
  maxConnection: 20,
  timeouts: {
    idle: 30000,
    connection: 20000,
  },
};
```
Model will use this file to initialise data source connection to the database.

## Entities And Models
**Entities** and **Models** are classes that maps a database table to the class.\
**Entities** are using in **Data Mapper** pattern.\
**Models** are using in **Active Record** pattern. Model should extend ```BaseModel``` class.
Models and Entities classes should be marked with `@Entity('users')` decorator. Decorator `@Entity` has one parameter - database table name.
Each Model or Entity should contain `@PrimaryAutoIncrementColumn` or `@PrimaryKeyColumn` property.\
Example of Entity:
```ts
@Entity('users')
class User extends BaseModel {
  @PrimaryAutoIncrementColumn()
  id: number;

  @Length(2, 256)
  @Column()
  name: string;

  @IsInteger()
  @IsUnsigned()
  @Column()
  age: number;

  @Length(5, 50)
  @Column()
  email: string;

  @Column({
    defaultValue: false,
  })
  active: boolean;

  @IsInteger()
  @IsUnsigned()
  @Column({
    customName: 'address_id',
  })
  addressId: number;

  @Enum([Role.Admin, Role.Customer])
  @Column()
  role: Role;

  @OneToOne({
    field: 'addressId',
    relatedEntityField: 'id',
    getRelatedEntity: () => Address,
  })
  address: Address;

  @OneToMany({
    field: 'id',
    relatedEntityField: 'userId',
    getRelatedEntity: () => Product,
  })
  products: Product[];

  @ManyToMany({
    getRelatedEntity: () => Tag,
    intermediateTable: {
      name: 'user_tags',
      fieldNames: {
        currentEntityField: 'id',
        relatedEntityField: 'id',
        currentTableIntermediateField: 'user_id',
        relatedTableIntermediateField: 'tag_id',
      },
    },
  })
  tags: Tag[];
}
```
**EasyNodeORM** supports the next **Entities** and **Models** decorators:

### `@PrimaryAutoIncrementColumn`
It identifies primary auto increment column of database table. 
Parameters:
* `customName` - optional parameter in case table column differs from class property name.
### `@PrimaryKeyColumn`
It identifies primary column of database table.
Parameters:
* `customName` - optional parameter in case table column differs from class property name.
### `@Column`
It identifies column of database table. It has one optional parameter `columnProps`. It is the object with the next properties:
* `customName` -  optional parameter in case table column name differs from class property name.
* `defaultValue` - default value for table column. If `defaultValue` is not defined then column is required.
### `@Enum`
It identifies list of allowed values.
### `@IsInteger`
### `@IsUnsigned`
### `@Length`
This decorator could be used in case custom length should be set for column.
Parameters:
* `min` - minimum length
* `max` - maximum length. Parameter is optional.
### `@OneToOne`
Decorator allows you to set up **one-to-one** relation.

Example:
```ts
@OneToOne({
  field: 'addressId', // enity property name
  relatedEntityField: 'id', // related entity property name
  getRelatedEntity: () => Address, // should return related entity
})
```
### `@OneToMany`
Decorator allows you to set up **one-to-many** relation.

Example:
```ts
@OneToMany({
  field: 'id', // enity property name
  relatedEntityField: 'userId', // related entity property name
  getRelatedEntity: () => Product, // should return related entity
})
```
### `@ManyToOne`
Decorator allows you to set up **many-to-one** relation.

Example:
```ts
@ManyToOne({
  field: 'userId', // enity property name
  relatedEntityField: 'id',  // related entity property name
  getRelatedEntity: () => User,  // should return related entity
})
```
### `@ManyToMany`
Decorator allows you to set up **many-to-many** relation.

Example:
```ts
@ManyToMany({
  getRelatedEntity: () => Tag, // should return related entity
  intermediateTable: {
    name: 'user_tags', // intermadiate table name
    fieldNames: {
      currentEntityField: 'id', // current enity property name
      relatedEntityField: 'id', // related entity property name
      currentTableIntermediateField: 'user_id', // column name for current entity in intermediate table
      relatedTableIntermediateField: 'tag_id', // column name for related entity in intermediate table
    },
  },
})
```

## Insert Data
Both **Active Record** and **Data Mapper** support insert operations. 
Data could be inserted together with related entities. In case relation type is **many-to-many** then related rows should be inserted before, so then it could be attached to entity.
All columns should be initialized with proper values. In other case **EasyNodeORM** throws the error.

### Data Mapper
In data mapper specific repository should be created for entity in order to save it.
Example: `const tagRepository = postgresDataSource.getRepository(Tag)`
Repository support method `create`. It has two parameters:
* `entity` - entity object
* `withRelations` - it contains list of related entities to save together with entity. `all` - in case all related entities should be saved.

Example:
```ts
  const tagRepository = postgresDataSource.getRepository(Tag);
  const userRepository = postgresDataSource.getRepository(User);

  const musicTagToCreate = new Tag();
  musicTagToCreate.name = 'music';
  const musicTag = await tagRepository.create(musicTagToCreate);

  const travellingTagToCreate = new Tag();
  travellingTagToCreate.name = 'travelling';
  const travellingTag = await tagRepository.create(travellingTagToCreate);

  const user = new User();
  user.name = 'Test User';
  user.age = 30;
  user.email = 'User_test@gmail.com';
  user.role = Role.Customer;

  const address = new Address();
  address.country = 'Ukraine';
  address.city = 'Lviv';
  address.postalCode = 'Custom';
  address.address = 'Test address';

  const guitar = new Product();
  guitar.name = 'Guitar';
  guitar.price = 300;
  const drums = new Product();
  drums.name = 'Drums';
  drums.price = 676;

  user.address = address;
  user.products = [guitar, drums];
  user.tags = [musicTag, travellingTag];

  return await userRepository.create(user, ['address', 'products', 'tags']);
```
### Active Record
Model support method `create`. It has one parameter:
* `withRelations` - it contains list of related models to save together with model. `all` - in case all related models should be saved.
  
Example:
```ts
  const user = new User();
  user.name = 'Test User';
  user.age = 30;
  user.email = 'User_test2332ddssss3@gmail.com';
  user.role = Role.Customer;

  const address = new Address();
  address.country = 'Ukraine';
  address.city = 'Lviv';
  address.postalCode = 'Custom';
  address.address = 'Test address';
  user.address = address;

  const guitar = new Product();
  guitar.name = 'Guitar';
  guitar.price = 300;

  user.products = [guitar];

  const musicTagToCreate = new Tag();
  musicTagToCreate.name = 'music';
  const musicTag = await musicTagToCreate.create();

  user.tags = [musicTag];

  await user.create(['all']);
```
## Get Data
### Data Mapper
In data mapper specific repository should be created for entity before querying data.

Supported methods:
* `getOne` - query one row if exists. If it does not exist then it returns null.
* `get` - query rows by parameters
* `populate` - query needed related data and attach it to entity

Example:
```ts
  const userRepository = postgresDataSource.getRepository(User);

  await userRepository.get({
    logicalOperator: LogicalOperator.Not,
    conditions: [
      {
        logicalOperator: LogicalOperator.Or,
        conditions: [
          {
            id: 60,
          },
          {
            role: Role.Admin,
          },
          {
            addressId: 100,
          },
        ],
      },
    ],
  });

  const user = await userRepository.get({
    id: 76,
  });
  const userWithRelations = await userRepository.populate(user[0], ['all']);

  const product = userWithRelations.products[0];

  const productRepository = postgresDataSource.getRepository(Product);
  await productRepository.populate(product, ['all']);
```
### Active Record
Supported methods:
* `getOne` - query one row if exists. In other case null.
* `populate` - query needed related data and attach it to model

Example:
```ts
  const user = await User.getOne<User>({ id: 77 });

  await user.populate(['all']);

  const product = user.products[0];
  await product.populate(['all']);
```
## Delete Data
### Data Mapper
In data mapper specific repository should be created for entity before removing data.

Supported methods:
*  `deleteEntity` - delete one row
*  `delete` - delete many rows

Example:
```ts
  const productRepository = postgresDataSource.getRepository(Product);

  await productRepository.delete(
    {
      userId: 60,
    },
    true,
  );

  const products = await productRepository.get({ id: 29 });
  return await productRepository.deleteEntity(products[0]);
```
### Active Record
Supported methods:
*  `delete` - delete one row

Example:
```ts
  const product = await Product.getOne<Product>({ id: 92 });

  await product.delete();
```
## Update Data
Both **Active Record** and **Data Mapper** support updating operations.
Data could be updating together with **many-to-many** related entities. In case relation type is not **many-to-many** then related rows should be updated separately.
All columns should be initialized with proper values. In other case **EasyNodeORM** throws the error.
### Data Mapper
In data mapper specific repository should be created for entity before updating data.

Supported methods:
* `updateEntity` - update one row with relations
* `update` - update many rows with relations

Example:
```ts
  const productRepository = postgresDataSource.getRepository(Product);
  const tagsRepository = postgresDataSource.getRepository(Tag);
  const userRepository = postgresDataSource.getRepository(User);

  const products = await productRepository.get({ id: 27 });
  const productToUpdate = products[0];
  productToUpdate.price = 1200;
  productToUpdate.name = 'Drums';

  await productRepository.updateEntity(productToUpdate);

  await productRepository.update({ price: 700 }, { userId: 61 }, true);

  const tag1 = await tagsRepository.getOne({ id: 11 });
  const tag2 = await tagsRepository.getOne({ id: 12 });

  const user = await userRepository.getOne({ id: 78 });
  user.tags = [tag1, tag2];

  await userRepository.updateEntity(user, ['all']);
```
### Active Record
Supported methods:
* `update` - update one row with relations

Example:
```ts
  const tag1 = await Tag.getOne<Tag>({ id: 13 });
  const tag2 = await Tag.getOne<Tag>({ id: 14 });

  const user = await User.getOne<User>({ id: 74 });
  user.active = true;
  user.age = 40;
  user.name = 'Updated User';
  user.tags = [tag1, tag2];

  await user.update(['all']);
```
## Query Builder
**EasyNodeORM** also supports raw requests to the database using query builder.
At the moment it is supported only by **Data Mapper**. 
Data Source query manager contains select method to query data from database: `await postgresDataSource.queryManager.select(select)`\
Complex example of raw request to query data from database:
```ts
  await postgresDataSource.queryManager.select({
    table: {
      name: 'users',
      alias: 'u',
    },
    columns: [
      {
        name: 't.id',
        alias: 'tagId',
      },
      {
        name: 't.name',
        alias: 'tagName',
      },
      {
        name: 'u.name',
        alias: 'userName',
      },
      {
        name: 'u.id',
        alias: 'userId',
      },
      'age',
      'email',
      'active',
      'role',
    ],
    joins: [
      {
        type: JoinVariant.Left,
        table: 'user_tags',
        on: {
          column: 'u.id',
          joinedTableColumn: 'user_tags.user_id',
        },
      },
      {
        type: JoinVariant.Left,
        table: {
          name: 'tags',
          alias: 't',
        },
        on: {
          column: 'user_tags.tag_id',
          joinedTableColumn: 't.id',
        },
      },
    ],
    where: {
      logicalOperator: LogicalOperator.Not,
      conditions: [
        {
          ['t.id']: {
            is: null,
          },
        },
        {
          logicalOperator: LogicalOperator.Or,
          conditions: [
            {
              age: {
                lowerThanEqual: 50,
                greaterThan: 20,
              },
            },
            {
              ['u.id']: 78,
            },
          ],
        },
      ],
    },
  });
```
It equals to the next sql query:
```
SELECT t.id AS tagId, t.name AS tagName, u.name AS userName, u.id AS userId, age, email, active, role 
FROM users AS u 
LEFT JOIN user_tags ON u.id = user_tags.user_id 
LEFT JOIN tags AS t ON user_tags.tag_id = t.id 
WHERE NOT (t.id IS NULL AND ((age <= 50 AND age > 20) OR u.id = 78))
```

Select supports the next params:
### `table`
It contains table name to query.

It could be a string, an alias or a sub-query.\
Example:
```ts
const table  = {
  name: 'users', 
  alias: 'u',
}
```
### `columns`
It contains list of columns to return from database.
Could be string or alias.
```ts
const columns = [
  {
    name: 't.id',
    alias: 'tagId',
  },
  {
    name: 't.name',
    alias: 'tagName',
  },
  'age',
];
```

In case aggregation method need to be applied to returned column then `aggregationMethod` param should be defined
```ts
const columns = [
  {
    name: 'age',
    alias: 'averageAge',
    aggregationMethod: 'avg'
  }
];
```

In case distinct values need to be returned then `distinct` param should be `true`
```ts
const columns = [
  {
    name: 'u.name',
    alias: 'userName',
    distinct: true
  }
];
```

### `limit`
`limit` could be used to return limited amount of rows
### offset
`offset` could be used to skip some amount of rows.
### order
`order` could be used in case results should be ordered by some values
```ts
const order = [{
  column: 'age',
  order: Order.Asc
}];
```
### groupBy
`groupBy` Could be used in case results should be grouped by some value:
```ts
const groupedBy = ['age'];
```

### joins
`joins` should be used in case some related table should be joined to queried table.

Example:
```ts
const joins = [
  {
    type: JoinVariant.Left,
    table: 'user_tags',
    on: {
      column: 'u.id',
      joinedTableColumn: 'user_tags.user_id',
    },
  },
];
```
### where
`where` is used to filter result records.
Example:
```ts
const where = {
  logicalOperator: LogicalOperator.Not,
  conditions: [
    {
      ['t.id']: {
        is: null,
      },
    },
    {
      logicalOperator: LogicalOperator.Or,
      conditions: [
        {
          age: {
            lowerThanEqual: 50,
            greaterThan: 20,
          },
        },
        {
          ['u.id']: 78,
        },
      ],
    },
  ],
};
```

It equals to the next SQL code:
```
 WHERE NOT (t.id IS NULL AND ((age <= 50 AND age > 20) OR u.id = 78))
```

### having
`having` could receive the same values as `where`. It is needed to filter result records in case aggregation function is used.

## Data Definition Queries
**EasyNodeORM** also supports raw requests to the database using query builder.
At the moment it is supported only by **Data Mapper**. 
### `createTable`
`createTable` method could be used to create a new database table.\
Example of request:
```ts
export const columnsUser: ColumnProps<AllowedPostgresTypes>[] = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    autoGenerationStrategy: AutoGenerationStrategy.Increment,
  },
  {
    name: 'name',
    type: 'varchar',
    length: 256,
  },
  {
    name: 'age',
    type: 'smallint',
  },
  {
    name: 'email',
    type: 'varchar',
    length: 50,
    isUnique: true,
  },
  {
    name: 'active',
    type: 'boolean',
    default: false,
  },
  {
    name: 'address_id',
    type: 'int',
    isUnique: true,
  },
  {
    name: 'role',
    type: 'enum',
    enum: ['Admin', 'Customer'],
    enumTypeName: 'user_role',
  },
];
await postgresDataSource.dataDefinitionQueryManager.createTable(
  'users',
  columnsUser,
);
```
### `dropTable`
`dropTable` method could be used to remove a database table.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.dropTable('users');
```
### `createForeignKey`
`createForeignKey` method could be used to create a foreign key.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.createForeignKey({
  table: 'user_tags',
  tableColumn: 'tag_id',
  referenceTable: 'tags',
  referenceTableColumn: 'id',
  foreignKeyName: 'user_tags_tag_id_tags_id',
});
```
### `dropForeignKey`
`dropForeignKey` method could be used to remove a foreign key.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.dropForeignKey(
  'user_tags',
  'user_tags_tag_id_tags_id',
);
```
### `createIndex`
`createIndex` method could be used to create an index.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.createIndex({
  table: 'users',
  tableColumns: ['email'],
  indexName: 'users_email',
});
```
### `dropIndex`
`dropIndex` method could be used to remove an index.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.dropIndex('users_email');
```
### `addColumn`
`addColumn` method could be used to add new a column to existing table.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.addColumn('users', {
  name: 'age',
  type: 'smallint'
});
```
### `dropColumn`
`dropColumn` method could be used to to remove a column of a table.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.dropColumn('users', 'age');
```
### `renameColumn`
`renameColumn` method could be used to remove existing column of a table.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.renameColumn('users', 'age', 'newAgeName');
```
### `dropColumnDefaultValue`
`dropColumnDefaultValue` method could be used to remove default value of existing table column.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.dropColumnDefaultValue('users', 'age');
```
### `setColumnDefaultValue`
`setColumnDefaultValue` method could be used to set default value of existing table column.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.setColumnDefaultValue('users', 'age', 10);
```
### `changeColumnType`
`changeColumnType` method could be used to change existing table column type.\
Example of request:
```ts
await postgresDataSource.dataDefinitionQueryManager.changeColumnType('users', {
  name: 'age',
  newType: 'varchar',
  length: 50
});
```