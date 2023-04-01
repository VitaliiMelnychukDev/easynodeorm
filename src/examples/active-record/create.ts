import User, { Role } from './models/User';
import Address from './models/Address';
import Product from './models/Product';
import Tag from './models/Tag';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testCreate = async (): Promise<void> => {
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
};
