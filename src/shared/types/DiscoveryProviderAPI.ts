import * as t from 'io-ts'

export const CoverPhoto = t.partial({ '640x': t.string, '2000x': t.string })
export type CoverPhoto = t.TypeOf<typeof CoverPhoto>

export const favorite = t.type({
  favorite_item_id: t.string,
  favorite_type: t.string,
  user_id: t.string
})
export type favorite = t.TypeOf<typeof favorite>

export const FavoritesResponse = t.partial({ data: t.array(favorite) })
export type FavoritesResponse = t.TypeOf<typeof FavoritesResponse>

export const PlaylistArtwork = t.partial({
  '150x150': t.string,
  '480x480': t.string,
  '1000x1000': t.string
})
export type PlaylistArtwork = t.TypeOf<typeof PlaylistArtwork>

export const ProfilePicture = t.partial({
  '150x150': t.string,
  '480x480': t.string,
  '1000x1000': t.string
})
export type ProfilePicture = t.TypeOf<typeof ProfilePicture>

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

export const PlaylistTracksResponse = t.partial({ data: t.array(Track) })
export type PlaylistTracksResponse = t.TypeOf<typeof PlaylistTracksResponse>

export const TrackResponse = t.partial({ data: Track })
export type TrackResponse = t.TypeOf<typeof TrackResponse>

export const TrackSearch = t.partial({ data: t.array(Track) })
export type TrackSearch = t.TypeOf<typeof TrackSearch>

export const TracksResponse = t.partial({ data: t.array(Track) })
export type TracksResponse = t.TypeOf<typeof TracksResponse>

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

export const Activity = t.partial({
  timestamp: t.string,
  item_type: t.union([t.literal('track'), t.literal('playlist')]),
  item: t.union([Track, Playlist])
})
export type Activity = t.TypeOf<typeof Activity>

export const Reposts = t.partial({ data: t.array(Activity) })
export type Reposts = t.TypeOf<typeof Reposts>

export const PlaylistResponse = t.partial({ data: t.array(Playlist) })
export type PlaylistResponse = t.TypeOf<typeof PlaylistResponse>

export const PlaylistSearchResult = t.partial({ data: t.array(Playlist) })
export type PlaylistSearchResult = t.TypeOf<typeof PlaylistSearchResult>

export const UserResponse = t.partial({ data: User })
export type UserResponse = t.TypeOf<typeof UserResponse>

export const UserSearch = t.partial({ data: t.array(User) })
export type UserSearch = t.TypeOf<typeof UserSearch>

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

export const PlaylistAddedTimestamp = t.type({
  timestamp: t.number,
  track_id: t.string
})
export type PlaylistAddedTimestamp = t.TypeOf<typeof PlaylistAddedTimestamp>

export const Repost = t.type({
  repost_item_id: t.string,
  repost_type: t.string,
  user_id: t.string
})
export type Repost = t.TypeOf<typeof Repost>

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

export const TrackSegment = t.type({
  duration: t.number,
  multihash: t.string
})
export type TrackSegment = t.TypeOf<typeof TrackSegment>

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

export const FullRemix = t.type({
  parent_track_id: t.string,
  user: UserFull,
  has_remix_author_reposted: t.boolean,
  has_remix_author_saved: t.boolean
})
export type RemixFull = t.TypeOf<typeof FullRemix>

export const RemixParentFull = t.partial({ tracks: t.array(FullRemix) })
export type RemixParentFull = t.TypeOf<typeof RemixParentFull>

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
    followee_favorites: t.array(favorite),
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
    followee_favorites: t.array(favorite),
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

export const ActivityFull = t.partial({
  timestamp: t.string,
  item_type: t.union([t.literal('track'), t.literal('playlist')]),
  item: t.union([TrackFull, PlaylistFull])
})
export type ActivityFull = t.TypeOf<typeof ActivityFull>

export const RemixesResponse = t.intersection([
  t.type({ count: t.number }),
  t.partial({ tracks: t.array(TrackFull) })
])
export type RemixesResponse = t.TypeOf<typeof RemixesResponse>

export const SearchResponse = t.intersection([
  t.type({
    users: t.array(UserFull),
    tracks: t.array(TrackFull),
    playlists: t.array(PlaylistFull),
    albums: t.array(PlaylistFull)
  }),
  t.partial({
    followed_users: t.array(UserFull),
    saved_tracks: t.array(TrackFull),
    saved_playlists: t.array(PlaylistFull),
    saved_albums: t.array(PlaylistFull)
  })
])
export type SearchResponse = t.TypeOf<typeof SearchResponse>

export const VersionMetadata = t.type({
  service: t.string,
  version: t.string
})
export type VersionMetadata = t.TypeOf<typeof VersionMetadata>

export const FavoritesResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(ActivityFull) })
])
export type FavoritesResponseFull = t.TypeOf<typeof FavoritesResponseFull>

export const FollowersResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(UserFull) })
])
export type FollowersResponse = t.TypeOf<typeof FollowersResponse>

export const FollowingResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(UserFull) })
])
export type FollowingResponse = t.TypeOf<typeof FollowingResponse>

export const FollowingResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(UserFull) })
])
export type FollowingResponseFull = t.TypeOf<typeof FollowingResponseFull>

export const PlaylistResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(PlaylistFull) })
])
export type PlaylistResponseFull = t.TypeOf<typeof PlaylistResponseFull>

export const RepostsFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(ActivityFull) })
])
export type RepostsFull = t.TypeOf<typeof RepostsFull>

export const TrackResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: TrackFull })
])
export type TrackResponseFull = t.TypeOf<typeof TrackResponseFull>

export const TracksFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(TrackFull) })
])
export type TracksFull = t.TypeOf<typeof TracksFull>

export const TracksResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(TrackFull) })
])
export type TracksResponseFull = t.TypeOf<typeof TracksResponseFull>

export const UserResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(UserFull) })
])
export type UserResponseFull = t.TypeOf<typeof UserResponseFull>

export const RemixesResponseFull = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: RemixesResponse })
])
export type RemixesResponseFull = t.TypeOf<typeof RemixesResponseFull>

export const RemixingResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(TrackFull) })
])
export type RemixingResponse = t.TypeOf<typeof RemixingResponse>

export const SearchAutocompleteResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: SearchResponse })
])
export type SearchAutocompleteResponse = t.TypeOf<
  typeof SearchAutocompleteResponse
>

export const SearchFullResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: SearchResponse })
])
export type SearchFullResponse = t.TypeOf<typeof SearchFullResponse>

export const StemsResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(StemFull) })
])
export type StemsResponse = t.TypeOf<typeof StemsResponse>

export const TopGenreUsersResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    owner_wallet: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(UserFull) })
])
export type TopGenreUsersResponse = t.TypeOf<typeof TopGenreUsersResponse>
