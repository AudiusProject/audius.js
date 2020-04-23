import libs, { awaitInit } from '../libs'
import { TrackID, Track } from '../shared/types/track'

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
const get = async (id: TrackID) => {
  await awaitInit()
  const track: Track = await libs.discoveryProvider.getTracks(
    1,
    0,
    [id]
  )
  return track
}


export default get
