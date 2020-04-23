import { ID, CID, OnChain, Timestamped } from './common'

export type TrackID = ID

export type TrackSegment = {
  duration: string
  multihash: CID
}

interface Download {
  is_downloadable: boolean
  requires_follow: boolean
  cid: string
}

type FieldVisibility = {
  genre: boolean
  mood: boolean
  tags: boolean
  share: boolean
  play_count: boolean
}

export type Track =
OnChain &
Timestamped & {
  isrc: string | null
  iswc: string | null
  credits_splits: string | null
  description: string
  file_type: string | null
  genre: string
  has_current_user_reposted: boolean
  is_current: boolean
  download: Download | null
  length: number | null
  license: string
  mood: string
  owner_id: ID
  release_date: string
  repost_count: number
  save_count: number
  tags: string
  title: string
  track_segments: TrackSegment[]
  cover_art: string
  is_unlisted: boolean
  field_visibility?: FieldVisibility
}
