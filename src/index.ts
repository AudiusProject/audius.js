import { ID } from 'shared/types/common'
import * as tracks from './tracks'
import * as users from './users'

import AudiusLibs from '@audius/libs'
import { libsConfig } from 'libs'
import EventEmitter from 'eventemitter3'
import { generateM3U8Variants } from 'shared/util'

const LIBS_INIT = 'INITIALIZED'

type AudiusConfig = {
  recordPlays: boolean,
}
class Audius {
  private libs: any
  private libsInitted: boolean
  private recordPlays: boolean
  private libsEventEmitter: EventEmitter<string>

  constructor({
    recordPlays
  }: AudiusConfig = {
    recordPlays: process.env.NODE_ENV === 'production'
  }) {
    this.libs = new AudiusLibs(libsConfig)
    this.libsInitted = false
    this.libsEventEmitter = new EventEmitter<string>()
    this.recordPlays = recordPlays

    // TODO: remove me
    console.log({recordPlays: this.recordPlays})

    this.libs.init().then(() => {
      this.libsInitted = true
      this.libsEventEmitter.emit(LIBS_INIT)
    }).catch((err: any) => {
      console.log(`Got err initializing libs: [${err}]`)
      // TODO: handle this unhappy path
    })
  }

  async getTrackManifest(trackId: ID) {
    await this.awaitLibsInit()
    try {
      const track = await tracks.get(this.libs, trackId)
      if (!track) throw new Error(`No track for ID: ${trackId}`)

      const user = await users.get(this.libs, track.owner_id)
      if (!user) throw new Error(`No user for ID: ${track.owner_id}`)
      const gateways = user.creator_node_endpoint.split(',')
      const variants = generateM3U8Variants(track.track_segments, [], gateways)
      return variants
    } catch (err) {
      console.log(`Error getting track: ${err.message}`)
      throw err
    }
  }

  private async awaitLibsInit() {
    return new Promise((resolve) => {
      if (this.libsInitted) resolve()
      this.libsEventEmitter.on(LIBS_INIT, resolve)
    })
  }
}

export default Audius
