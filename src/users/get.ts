import libs, { provide } from '../libs'
import { UserID, User } from '../types/user'

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
const get = provide(
  async (id: UserID) => {
    const user: User = await libs.discoveryProvider.getUsers(
      1,
      0,
      [id]
    )
    return user
  }
)

export default get
