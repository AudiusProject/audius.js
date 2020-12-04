import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { PlaylistFull } from '../models/Playlists'

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
