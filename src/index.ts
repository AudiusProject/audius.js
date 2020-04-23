import { ID } from 'shared/types/common'
import * as tracks from './tracks'


class Audius {
  constructor() {
  }

  async getTrackManifest(trackId: ID) {
    const track = await tracks.get(trackId)
    console.log({track})
    return track
  }
}

export default Audius

const a = new Audius()
console.log('Getting track')
a.getTrackManifest(1).then(t => {
  console.log('Got track!')
  console.log({t})
})
