// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from './models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testSelect = async (): Promise<void> => {
  const user = await new User().get({ id: 77 });

  await user.populate(['all']);

  const product = user.products[0];
  await product.populate(['all']);
};
