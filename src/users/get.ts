import { UserID, User } from '../shared/types/user'

const get = async (libs: any, id: UserID) => {
  const users: User[] = await libs.discoveryProvider.getUsers(
    1,
    0,
    [id]
  )
  if (!users.length) return undefined
  return users[0]
}

export default get
