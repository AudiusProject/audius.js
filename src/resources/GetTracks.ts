import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { TrackFull, Track } from '../models/Tracks'

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

export const TrackResponse = t.partial({ data: Track })
export type TrackResponse = t.TypeOf<typeof TrackResponse>

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
