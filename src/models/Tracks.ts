import * as t from 'io-ts'
import { Favorite, Repost } from './Social'

import { User, UserFull } from './Users'

export const TrackArtwork = t.partial({
  '150x150': t.string,
  '480x480': t.string,
  '1000x1000': t.string
})
export type TrackArtwork = t.TypeOf<typeof TrackArtwork>

export const TrackElement = t.type({ parent_track_id: t.string })
export type TrackElement = t.TypeOf<typeof TrackElement>

export const RemixParent = t.partial({ tracks: t.array(TrackElement) })
export type RemixParent = t.TypeOf<typeof RemixParent>

export const StemFull = t.type({
  id: t.string,
  parent_id: t.string,
  category: t.string,
  cid: t.string,
  user_id: t.string,
  blocknumber: t.number
})
export type StemFull = t.TypeOf<typeof StemFull>

export const StemParent = t.type({
  category: t.string,
  parent_track_id: t.number
})
export type StemParent = t.TypeOf<typeof StemParent>

export const DownloadMetadata = t.intersection([
  t.type({ is_downloadable: t.boolean, requires_follow: t.boolean }),
  t.partial({ cid: t.string })
])
export type DownloadMetadata = t.TypeOf<typeof DownloadMetadata>

export const FieldVisibility = t.partial({
  mood: t.boolean,
  tags: t.boolean,
  genre: t.boolean,
  share: t.boolean,
  play_count: t.boolean,
  remixes: t.boolean
})
export type FieldVisibility = t.TypeOf<typeof FieldVisibility>

export const Track = t.intersection([
  t.type({
    id: t.string,
    repost_count: t.number,
    favorite_count: t.number,
    title: t.string,
    user: User,
    duration: t.number,
    play_count: t.number
  }),
  t.partial({
    artwork: TrackArtwork,
    description: t.string,
    genre: t.string,
    mood: t.string,
    release_date: t.string,
    remix_of: RemixParent,
    tags: t.string,
    downloadable: t.boolean
  })
])
export type Track = t.TypeOf<typeof Track>

export const FullRemix = t.type({
  parent_track_id: t.string,
  user: UserFull,
  has_remix_author_reposted: t.boolean,
  has_remix_author_saved: t.boolean
})
export type RemixFull = t.TypeOf<typeof FullRemix>

export const RemixParentFull = t.partial({ tracks: t.array(FullRemix) })
export type RemixParentFull = t.TypeOf<typeof RemixParentFull>

export const TrackSegment = t.type({
  duration: t.number,
  multihash: t.string
})
export type TrackSegment = t.TypeOf<typeof TrackSegment>

export const TrackFull = t.intersection([
  t.type({
    id: t.string,
    repost_count: t.number,
    favorite_count: t.number,
    title: t.string,
    user: UserFull,
    duration: t.number,
    play_count: t.number,
    blocknumber: t.number,
    followee_reposts: t.array(Repost),
    has_current_user_reposted: t.boolean,
    is_unlisted: t.boolean,
    has_current_user_saved: t.boolean,
    followee_favorites: t.array(Favorite),
    route_id: t.string,
    user_id: t.string
  }),
  t.partial({
    artwork: TrackArtwork,
    description: t.string,
    genre: t.string,
    mood: t.string,
    release_date: t.string,
    remix_of: RemixParentFull,
    tags: t.string,
    downloadable: t.boolean,
    create_date: t.string,
    cover_art_sizes: t.string,
    created_at: t.string,
    credits_splits: t.string,
    download: DownloadMetadata,
    isrc: t.string,
    license: t.string,
    iswc: t.string,
    field_visibility: FieldVisibility,
    stem_of: StemParent,
    track_segments: t.array(TrackSegment),
    updated_at: t.string,
    is_delete: t.boolean,
    cover_art: t.string
  })
])
export type TrackFull = t.TypeOf<typeof TrackFull>
