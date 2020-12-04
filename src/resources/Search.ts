import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { TrackFull, Track } from '../models/Tracks'
import { UserFull } from '../models/Users'
import { Playlist, PlaylistFull } from '../models/Playlists'

export const PlaylistTracksResponse = t.partial({ data: t.array(Track) })
export type PlaylistTracksResponse = t.TypeOf<typeof PlaylistTracksResponse>

export const TrackSearch = t.partial({ data: t.array(Track) })
export type TrackSearch = t.TypeOf<typeof TrackSearch>

export const PlaylistSearchResult = t.partial({ data: t.array(Playlist) })
export type PlaylistSearchResult = t.TypeOf<typeof PlaylistSearchResult>

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
