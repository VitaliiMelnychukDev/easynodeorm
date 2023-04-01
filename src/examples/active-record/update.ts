import Tag from './models/Tag';
import User from './models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testUpdate = async (): Promise<void> => {
  const tag1 = await new Tag().get({ id: 13 });
  const tag2 = await new Tag().get({ id: 12 });

  const user = await new User().get({ id: 74 });
  user.active = true;
  user.age = 45;
  user.name = 'Updated Name';
  user.tags = [tag1, tag2];

  await user.update(['all']);
};
