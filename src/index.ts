/**
 * Audius.js is a client for the Audius Music network.
 * @packageDocumentation
 */

import { ID } from 'shared/types/common'
import * as tracks from './tracks'
import * as users from './users'

import AudiusLibs from '@audius/libs'
import libsConfig from 'libs/config'
import EventEmitter from 'eventemitter3'
import btoa from 'btoa'
import TrackMetadata from 'types/TrackMetadata'
import { generateM3U8, uuid } from 'shared/util'
import { Track } from 'shared/types/track'
import { recordPlayEvent, recordListenEvent, identify } from 'analytics'

/**
 * @hidden
 */
const LIBS_INIT = 'INITIALIZED'

/**
 * Configuration options for `Audius` class constructor.
 */
type AudiusConfig = {
  /**
   * Whether to record plays.
   * If undefined, will be inferred from NODE_ENV, with
   * recording only happening in production.
   */
  recordPlays?: boolean,

  /**
   * A descriptive ID representing this particular use of
   * Audius.js.
   */
  analyticsId: string
}

/**
 * The `Audius` class is the entry point to interacting with the Audius
 * music network.
 *
 * You should instantiate a single instance of this class.
 *
 * **Warning: All public methods for this class may throw! Handle with care.**
 *
 * @remark
 * Many of the methods accept `trackIds`.
 * `TrackIds` may be found by stripping off the trailing digits
 * from an Audius track URL: e.g. "https://audius.co/lido/life-of-peder-part-one-11786" => 11786
 */
class Audius {
  private libs: any
  private libsInitted: boolean
  private recordPlays: boolean
  private libsEventEmitter: EventEmitter<string>
  private analyticsId: string

  /**
   * Constructs a new instance of an Audius client.
   * @param configuration options
   */
  constructor({
    recordPlays,
    analyticsId
  }: AudiusConfig) {
    this.libs = new AudiusLibs(libsConfig)
    this.libsInitted = false
    this.libsEventEmitter = new EventEmitter<string>()
    this.recordPlays = recordPlays || (process.env.NODE_ENV === 'production')
    this.analyticsId = analyticsId

    identify(analyticsId)

    // Init libs
    this.libs.init().then(() => {
      this.libsInitted = true
      this.libsEventEmitter.emit(LIBS_INIT)
    }).catch((err: Error) => {
      console.warn(`Got error initializing libs: [${err.message}]`)
      throw new Error(err.message)
    })
  }

  /**
   * `getTrackDataURI` is the primary method through which to retrieve a streamable
   * track from Audius.
   *
   * This method returns a playable HLS track manifest, base64 encoded in as a data URI.
   *
   * @param trackId
   */
  async getTrackDataURI(trackId: ID) {
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

  /** `getTrackMetadata` returns metadata for a given track on the Audius network.
   *
   * @param trackId
   */
  async getTrackMetadata(trackId: ID): Promise<TrackMetadata> {
    console.debug(`Getting track metadata for track ID: ${trackId}`)
    await this.awaitLibsInit()
    try {
      const track: Track = await tracks.get(this.libs, trackId)
      if (!track) throw new Error(`No track found for ID ${trackId}`)

      return {
        title: track.title,
        description: track.description || "",
        genre: track.genre,
        mood: track.mood,
        ownerId: track.owner_id,
        path: track.route_id,
        trackId: track.track_id,
        tags: track.tags ? track.tags.split(',') : [],
        repostCount: track.repost_count,
        favoriteCount: track.save_count,
        releaseDate: new Date(track.release_date),
        userName: track.user.name,
        userHandle: track.user.handle
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

// Minor hack alert:
// `btoa` is required as a global
// for `Axios` to work properly, due to
// `XMLHttpRequest exported from web3
// causing axios to think we're in a browser environment.
// @ts-ignore
global.btoa = btoa

export default Audius
