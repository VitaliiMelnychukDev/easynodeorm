import postgresDataSource from './postgresDataSource';
import Product from './entities/Product';
import Tag from './entities/Tag';
import User from './entities/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testUpdate = async (): Promise<void> => {
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
};
