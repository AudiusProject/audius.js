import { UserID, User } from '../shared/types/user'

const get = async (libs: any, id: UserID): Promise<User | undefined> => {
  const users: User[] = await libs.discoveryProvider.getUsers(
    1,
    0,
    [id]
  )
  return users[0]
}

export default get
