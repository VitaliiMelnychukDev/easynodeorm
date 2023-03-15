import postgresDataSource from './postgresDataSource';
import { LogicalOperator } from '../drivers/types/where';
import { JoinVariant } from '../drivers/types/join';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testSelect = async (): Promise<void> => {
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
          joinTableColumn: 'user_tags.user_id',
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
          joinTableColumn: 't.id',
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
};
