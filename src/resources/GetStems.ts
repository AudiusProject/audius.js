import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { StemFull } from '../models/Tracks'

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
