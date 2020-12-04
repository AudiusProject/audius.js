import * as t from 'io-ts'

export const VersionMetadata = t.type({
  service: t.string,
  version: t.string
})
export type VersionMetadata = t.TypeOf<typeof VersionMetadata>
