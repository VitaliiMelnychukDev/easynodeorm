import postgresDataSource from '../postgresDataSource';
import Product from './entities/Product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testDelete = async (): Promise<void> => {
  const productRepository = postgresDataSource.getRepository(Product);

  await productRepository.delete(
    {
      userId: 60,
    },
    true,
  );

  const products = await productRepository.get({ id: 29 });
  return await productRepository.deleteEntity(products[0]);
};
