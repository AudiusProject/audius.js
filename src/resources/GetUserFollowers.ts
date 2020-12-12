import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { User } from '../models/Users'
import { Resource } from './Resource'

// Request Types

export type GetUserFollowsArgs = {
  userId: string
}
export type GetUserFollowsOptions = {
  offset?: number
  limit?: number
}

// Response Types

export const FollowersResponse = t.intersection([
  t.type({
    latest_chain_block: t.number,
    latest_indexed_block: t.number,
    signature: t.string,
    timestamp: t.string,
    version: VersionMetadata
  }),
  t.partial({ data: t.array(User) })
])
export type FollowersResponse = t.TypeOf<typeof FollowersResponse>

// Resource

export const getUserFollowsResource: Resource<
  GetUserFollowsArgs,
  GetUserFollowsOptions,
  FollowersResponse
> = {
  responseType: FollowersResponse,
  queryBuilder: (args, options, currentUserId) => ({
    path: `users/${args.userId}/followers`,
    queryParams: {
      user_id: currentUserId,
      limit: options.limit,
      offset: options.offset
    }
  }),
  isFull: true
}
