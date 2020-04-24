import { TrackID, Track } from '../shared/types/track'

const get = async (libs: any, id: TrackID) => {
  const tracks: Track[] = await libs.discoveryProvider.getTracks(
    1,
    0,
    [id]
  )
  if (tracks.length === 0) return undefined
  return tracks[0]
}

export default get
