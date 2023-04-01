import User, { Role } from './entities/User';
import postgresDataSource from '../postgresDataSource';
import { LogicalOperator } from '../../drivers/types';
import Product from './entities/Product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testSelect = async (): Promise<void> => {
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
};
