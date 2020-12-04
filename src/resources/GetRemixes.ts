import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { TrackFull } from '../models/Tracks'

export const RemixesResponse = t.intersection([
  t.type({ count: t.number }),
  t.partial({ tracks: t.array(TrackFull) })
])
export type RemixesResponse = t.TypeOf<typeof RemixesResponse>

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
