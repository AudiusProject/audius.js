import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { TrackFull } from '../models/Tracks'

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
