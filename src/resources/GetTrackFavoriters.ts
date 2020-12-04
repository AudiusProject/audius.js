import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { UserFull } from '../models/Users'

export const TrackFavoritersResponseFull = t.intersection([
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
export type TrackFavoritersResponseFull = t.TypeOf<
  typeof TrackFavoritersResponseFull
>
