import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { ActivityFull } from '../models/Activity'

export const GetUserRepostsResponseFull = t.intersection([
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
export type RepostsFull = t.TypeOf<typeof GetUserRepostsResponseFull>
