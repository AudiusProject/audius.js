import { ID } from 'shared/types/common'
import * as tracks from './tracks'
import * as users from './users'

import AudiusLibs from '@audius/libs'
import { libsConfig } from 'libs'
import EventEmitter from 'eventemitter3'
import btoa from 'btoa'
import { generateM3U8, uuid } from 'shared/util'
import { Track } from 'shared/types/track'
import { recordPlayEvent, recordListenEvent, identify } from 'analytics'

const LIBS_INIT = 'INITIALIZED'

type TrackMetadata = {
  description: string,
  genre: string
  mood: string,
  ownerId: number,
  path: string
  trackId: number
  tags: string[]
  repostCount: number
  favoriteCount: number
  releaseDate: Date
}

type AudiusConfig = {
  recordPlays?: boolean,
  analyticsId: string
}

// @ts-ignore
global.btoa = btoa
class Audius {
  private libs: any
  private libsInitted: boolean
  private recordPlays: boolean
  private libsEventEmitter: EventEmitter<string>
  private analyticsId: string

  constructor({
    recordPlays,
    analyticsId
  }: AudiusConfig) {
    this.libs = new AudiusLibs(libsConfig)
    this.libsInitted = false
    this.libsEventEmitter = new EventEmitter<string>()
    this.recordPlays = recordPlays || (process.env.NODE_ENV === 'production')
    this.analyticsId = analyticsId
    console.log(this.recordPlays)

    identify(analyticsId)

    // Init libs
    this.libs.init().then(() => {
      this.libsInitted = true
      this.libsEventEmitter.emit(LIBS_INIT)
    }).catch((err: any) => {
      console.log(`Got err initializing libs: [${err}]`)
      // TODO: handle this unhappy path
    })
  }

  // TODO: rename this something better?
  async getTrackManifest(trackId: ID) {
    console.debug(`Getting manifest for track ID ${trackId}`)
    await this.awaitLibsInit()
    try {
      if (this.recordPlays) recordListenEvent(trackId, this.analyticsId)

      const track = await tracks.get(this.libs, trackId)
      if (!track) throw new Error(`No track for ID: ${trackId}`)

      const user = await users.get(this.libs, track.owner_id)
      if (!user) throw new Error(`No user for ID: ${track.owner_id}`)

      const gateways = user.creator_node_endpoint.split(',').map(e => `${e}/ipfs/`)
      const m3u8 = generateM3U8(track.track_segments, [], gateways[0])

      if (this.recordPlays) {
        this.recordListen(trackId)
        recordPlayEvent(trackId, this.analyticsId)
      }

      return this.encodeDataURI(m3u8)
    } catch (err) {
      console.log(`Error getting track ID ${trackId}: ${err.message}`)
      throw err
    }
  }

  async getTrackMetadata(trackId: ID): Promise<TrackMetadata> {
    console.debug(`Getting track metadata for track ID: ${trackId}`)
    await this.awaitLibsInit()
    try {
      const tracks: Track[] = await this.libs.Track.getTracks(
        1, // Limit,
        0, // Ofset,
        [trackId],
      )

      const track = tracks[0]
      if (!track) throw new Error(`No track found for ID ${trackId}`)

      return {
        description: track.description || "",
        genre: track.genre,
        mood: track.mood,
        ownerId: track.owner_id,
        path: track.route_id,
        trackId: track.track_id,
        tags: track.tags ? track.tags.split(',') : [],
        repostCount: track.repost_count,
        favoriteCount: track.save_count,
        releaseDate: new Date(track.release_date)
      }
    } catch (err) {
      console.log(`Error getting metadata for track ID ${trackId}: ${err.msg}`)
      throw err
    }
  }

  private async recordListen(trackId: ID) {
    console.debug(`Recording listen for trackId: ${trackId}`)
    await this.awaitLibsInit()
    try {
      this.libs.Track.logTrackListen(trackId, uuid())
    } catch (err) {
      console.warn(`Got err recording listen for track ID ${trackId}: [${err.message}]`)
    }
  }

  private async awaitLibsInit() {
    return new Promise((resolve) => {
      if (this.libsInitted) resolve()
      this.libsEventEmitter.on(LIBS_INIT, resolve)
    })
  }

  private encodeDataURI(manifest: string) {
    return encodeURI(`data:application/vnd.apple.mpegURL;base64,${btoa(manifest)}`)
  }
}

export default Audius
