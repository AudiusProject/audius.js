import btoa from 'btoa'
import { isRight } from 'fp-ts/lib/Either'
import {
  getUserFollowsResource,
  GetUserFollowsArgs,
  GetUserFollowsOptions,
  Resource,
  QueryParams
} from 'resources/GetUserFollowers'
import fetch from 'node-fetch'

// Minor hack alert:
// `btoa` is required as a global
// for `Axios` to work properly, due to
// `XMLHttpRequest exported from web3
// causing axios to think we're in a browser environment.
// @ts-ignore
global.btoa = btoa

/**
 * Handles selecting discovery providers, reselecting, etc
 */
class DiscoveryNodeManager {
  init() {}
  getEndpoint() {
    // TODO: make this autoselect
    return 'https://discoveryprovider.audius.co'
  }
}

type Result<R, E extends Error> = (R & { error: null }) | { error: E }

type Nullable<T> = T | null

const success = <R, E extends Error>(result: R) => ({
  ...result,
  error: null as E
})
const error = <E extends Error>(error: E) => ({ error })

const ENDPOINT_PREFIXES = {
  full: 'v1/full',
  regular: 'v1'
}

/**
 * Handles making requests, retries, debouncing, etc
 */
class RESTClient {
  host: string
  currentUserId: string

  constructor({
    host,
    currentUserId
  }: {
    host: string
    currentUserId: Nullable<string>
  }) {
    this.host = host
    // TODO: this needs to be nullable
    this.currentUserId = currentUserId
  }

  async makeRequest<Args, Options, Output>(
    args: Args,
    options: Options,
    resource: Resource<Args, Options, Output>
    /* TODO - add retries here */
  ): Promise<Result<Output, any>> {
    const query = resource.queryBuilder(args, options, this.currentUserId)
    const endpoint = this._constructUrl(
      query.path,
      query.queryParams,
      resource.isFull
    )
    console.log({ endpoint })
    const res = await fetch(endpoint)
    const json = await res.json()
    const decoded = resource.decoder.decode(json)
    if (isRight(decoded)) {
      return success(decoded.right)
    } else {
      console.log('Got error!')
      console.log('Error: ' + JSON.stringify(decoded.left))
      // TODO: handle multiple errors!
      return error(new Error(decoded.left[0].message))
    }
  }

  _constructUrl(path: string, params: QueryParams, isFull: boolean) {
    const queryString = Object.entries(params)
      .filter(p => p[1] !== undefined && p[1] !== null)
      .map(p => {
        if (Array.isArray(p[1])) {
          return p[1].map(val => `${p[0]}=${encodeURIComponent(val)}`).join('&')
        }
        return `${p[0]}=${encodeURIComponent(p[1]!)}`
      })
      .join('&')
    const prefix = isFull ? ENDPOINT_PREFIXES.full : ENDPOINT_PREFIXES.regular
    return `${this.host}/${prefix}/${path}${
      queryString ? `?${queryString}` : ''
    }`
  }
}

const userRoutes = (client: RESTClient) => ({
  getFollowers: async (
    args: GetUserFollowsArgs,
    options: GetUserFollowsOptions = {}
  ) => {
    const resource = getUserFollowsResource
    return client.makeRequest(args, options, resource)
  }
})

/**
 * Top level class, orchestrates managers responsible
 * for performing more specific operations
 */
class Audius {
  discoveryNodeManager: DiscoveryNodeManager = null
  restClient: RESTClient = null
  Users: ReturnType<typeof userRoutes> = null /* TODO: need to type this */

  constructor() {
    this.discoveryNodeManager = new DiscoveryNodeManager()
    this.restClient = new RESTClient({
      host: 'https://discoveryprovider.audius.co',
      currentUserId: null
    })
    this.discoveryNodeManager.init()
    this.Users = userRoutes(this.restClient)
  }
}

export default Audius

const a = new Audius()
a.Users.getFollowers({ userId: 'nVvkb' }).then(res => {
  console.log({ res })
})
