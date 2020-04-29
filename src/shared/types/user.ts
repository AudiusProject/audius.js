import { ID, OnChain, Timestamped } from './common'

export type UserID = ID

export type User =
  OnChain &
  Timestamped &
{
  album_count: number
  bio: string
  cover_photo: string
  cover_photo_sizes: string
  creator_node_endpoint: string
  current_user_followee_follow_count: number
  does_current_user_follow: boolean
  followee_count: number
  follower_count: number
  handle: string
  handle_lc: string
  is_creator: boolean
  is_ready: boolean
  is_verified: boolean
  location: string
  metadata_multihash: string
  name: string
  playlist_count: number
  profile_picture: string
  profile_picture_sizes: string
  repost_count: number
  track_blocknumber: number
  track_count: number
  user_id: number
  wallet: string
}

export default User