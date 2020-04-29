/**
 * Metadata for a track on the Audius network.
 */
type TrackMetadata = {
  /**
   * The title of the track.
   */
  title: string
  /**
   *  The description of the track. May be an empty string.
   */
  description: string,

  /**
   *  The genre of the track.
   */
  genre: string

  /**
   * The mood of the track.
   */
  mood: string,

  /**
   * The ID of the uploading user.
   */
  ownerId: number,

  /**
   * The path of the track on the Audius network,
   * e.g. "lido/life-of-peder-part-one"
   */
  path: string

  /**
   * The ID of the uploaded track.
   */
  trackId: number

  /**
   * Tags describing the track.
   */
  tags: string[]

  /**
   * Total reposts count of a track.
   */
  repostCount: number

  /**
   * Total favorites count of a track.
   */
  favoriteCount: number

  /**
   * The date the track was originally
   * released on the Audius network.
   */
  releaseDate: Date

  /**
   * The name of the uploading user.
   */
  userName: string

  /**
   * The handle of the uploading user.
   */
  userHandle: string
}

export default TrackMetadata