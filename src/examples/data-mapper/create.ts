import postgresDataSource from '../postgresDataSource';
import Tag from './entities/Tag';
import User, { Role } from './entities/User';
import Address from './entities/Address';
import Product from './entities/Product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testCreate = async (): Promise<User> => {
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
};
