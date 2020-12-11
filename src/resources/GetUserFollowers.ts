import { Either } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { VersionMetadata } from '../models/Common'
import { User } from '../models/Users'

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

type Decoder<T> = {
  decode: (i: unknown) => Either<t.Errors, T>
}

// Move this to result utils

export type QueryParams = {
  [key: string]: string | number | undefined | boolean | Array<string> | null
}
// TODO: need to define error types
export type Resource<Args, Options, Output> = {
  queryBuilder: (
    args: Args,
    options: Options,
    currentUserId: string
  ) => { path: string; queryParams: QueryParams }
  decoder: Decoder<Output>
  isFull: boolean
}

export type GetUserFollowsArgs = {
  userId: string
}
export type GetUserFollowsOptions = {
  offset?: number
  limit?: number
}

export const getUserFollowsResource: Resource<
  GetUserFollowsArgs,
  GetUserFollowsOptions,
  FollowersResponse
> = {
  decoder: FollowersResponse,
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
