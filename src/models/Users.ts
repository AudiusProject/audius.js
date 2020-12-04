import * as t from 'io-ts'

export const CoverPhoto = t.partial({ '640x': t.string, '2000x': t.string })
export type CoverPhoto = t.TypeOf<typeof CoverPhoto>

export const ProfilePicture = t.partial({
  '150x150': t.string,
  '480x480': t.string,
  '1000x1000': t.string
})
export type ProfilePicture = t.TypeOf<typeof ProfilePicture>

export const User = t.intersection([
  t.type({
    album_count: t.number,
    followee_count: t.number,
    follower_count: t.number,
    handle: t.string,
    id: t.string,
    is_verified: t.boolean,
    name: t.string,
    playlist_count: t.number,
    repost_count: t.number,
    track_count: t.number
  }),
  t.partial({
    bio: t.string,
    cover_photo: CoverPhoto,
    location: t.string,
    profile_picture: ProfilePicture
  })
])
export type User = t.TypeOf<typeof User>

export const UserFull = t.intersection([
  t.type({
    album_count: t.number,
    followee_count: t.number,
    follower_count: t.number,
    handle: t.string,
    id: t.string,
    is_verified: t.boolean,
    name: t.string,
    playlist_count: t.number,
    repost_count: t.number,
    track_count: t.number,
    blocknumber: t.number,
    wallet: t.string,
    created_at: t.string,
    current_user_followee_follow_count: t.number,
    does_current_user_follow: t.boolean,
    handle_lc: t.string,
    is_creator: t.boolean,
    updated_at: t.string
  }),
  t.partial({
    bio: t.string,
    cover_photo: CoverPhoto,
    location: t.string,
    profile_picture: ProfilePicture,
    creator_node_endpoint: t.string,
    cover_photo_sizes: t.string,
    cover_photo_legacy: t.string,
    profile_picture_sizes: t.string,
    profile_picture_legacy: t.string
  })
])

export type UserFull = t.TypeOf<typeof UserFull>
