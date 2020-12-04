import * as t from 'io-ts'
import { Favorite, Repost } from './Social'
import { TrackFull } from './Tracks'
import { User, UserFull } from './Users'

export const PlaylistAddedTimestamp = t.type({
  timestamp: t.number,
  track_id: t.string
})
export type PlaylistAddedTimestamp = t.TypeOf<typeof PlaylistAddedTimestamp>

export const PlaylistArtwork = t.partial({
  '150x150': t.string,
  '480x480': t.string,
  '1000x1000': t.string
})
export type PlaylistArtwork = t.TypeOf<typeof PlaylistArtwork>

export const Playlist = t.intersection([
  t.type({
    id: t.string,
    is_album: t.boolean,
    playlist_name: t.string,
    repost_count: t.number,
    favorite_count: t.number,
    total_play_count: t.number,
    user: User
  }),
  t.partial({ artwork: PlaylistArtwork, description: t.string })
])
export type Playlist = t.TypeOf<typeof Playlist>

export const PlaylistFull = t.intersection([
  t.type({
    id: t.string,
    is_album: t.boolean,
    playlist_name: t.string,
    repost_count: t.number,
    favorite_count: t.number,
    total_play_count: t.number,
    user: UserFull,
    blocknumber: t.number,
    followee_reposts: t.array(Repost),
    followee_favorites: t.array(Favorite),
    has_current_user_reposted: t.boolean,
    has_current_user_saved: t.boolean,
    is_delete: t.boolean,
    is_private: t.boolean,
    added_timestamps: t.array(PlaylistAddedTimestamp),
    user_id: t.string,
    tracks: t.array(TrackFull)
  }),
  t.partial({
    artwork: PlaylistArtwork,
    description: t.string,
    created_at: t.string,
    updated_at: t.string,
    cover_art: t.string,
    cover_art_sizes: t.string
  })
])
export type PlaylistFull = t.TypeOf<typeof PlaylistFull>
