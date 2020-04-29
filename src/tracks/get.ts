import { TrackID, Track } from '../shared/types/track'

const get = async (libs: any, id: TrackID) => {
  const tracks: Track[] = await libs.discoveryProvider.getTracks(
    1, // Limit,
    0, // Ofset,
    [id], // idsArray
    null, // targetUserId
    null, // sort
    null, // minBlockNumber
    null, // filterDeleted
    true // withUsers
  )
  if (tracks.length === 0) return undefined
  return tracks[0]
}

export default get
