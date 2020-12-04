import * as t from 'io-ts'
import { Track, TrackFull } from './Tracks'
import { Playlist, PlaylistFull } from './Playlists'

export const Activity = t.partial({
  timestamp: t.string,
  item_type: t.union([t.literal('track'), t.literal('playlist')]),
  item: t.union([Track, Playlist])
})
export type Activity = t.TypeOf<typeof Activity>

export const ActivityFull = t.partial({
  timestamp: t.string,
  item_type: t.union([t.literal('track'), t.literal('playlist')]),
  item: t.union([TrackFull, PlaylistFull])
})
export type ActivityFull = t.TypeOf<typeof ActivityFull>
