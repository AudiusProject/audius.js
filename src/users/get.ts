import libs, { awaitInit } from '../libs'
import { UserID, User } from '../shared/types/user'

/**
 * Retrieves a track from the Audius protocol.
 *
 * ```
 *  const track = await get(2101)
 *  console.log(track.title)
 * ```
 *
 * @param id the id of the track
 */
const get = async (id: UserID) => {
  await awaitInit()
  const user: User = await libs.discoveryProvider.getUsers(
    1,
    0,
    [id]
  )
  return user
}

export default get
