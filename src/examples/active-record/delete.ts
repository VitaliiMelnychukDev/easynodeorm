import Product from './models/Product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testDelete = async (): Promise<void> => {
  const product = await new Product().get({ id: 92 });

  await product.delete();
};
