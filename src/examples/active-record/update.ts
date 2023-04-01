import Tag from './models/Tag';
import User from './models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testUpdate = async (): Promise<void> => {
  const tag1 = await Tag.getOne<Tag>({ id: 13 });
  const tag2 = await Tag.getOne<Tag>({ id: 14 });

  const user = await User.getOne<User>({ id: 74 });
  user.active = true;
  user.age = 40;
  user.name = 'Updated User';
  user.tags = [tag1, tag2];

  await user.update(['all']);
};
