import { Resource, QueryParams } from '../resources/Resource'
import { isRight } from 'fp-ts/lib/Either'
import fetch from 'node-fetch'
import { Result, successResult, errorResult } from '../types/Result'
import EventEmitter from 'eventemitter3'

const SET_HOST_EVENT = 'SET_HOST'

const ENDPOINT_PREFIXES = {
  full: 'v1/full',
  regular: 'v1'
}

/**
 * Handles making requests, retries, debouncing, etc
 */
export class RESTClient {
  _host?: string
  _currentUserId?: string
  _setHostEmitter: EventEmitter

  constructor({
    host,
    currentUserId
  }: {
    host?: string
    currentUserId?: string
  } = {}) {
    this._host = host
    // TODO: this needs to be nullable
    this._currentUserId = currentUserId
    this._setHostEmitter = new EventEmitter()
  }

  setHost(host: string) {
    this._host = host
    this._setHostEmitter.emit(SET_HOST_EVENT)
  }

  async _getHost(): Promise<string> {
    if (this._host) return this._host
    return new Promise(resolve => {
      console.debug('Called endpoint without host, waiting for selection')
      const listener = () => {
        const host = this._host
        if (host) {
          this._setHostEmitter.removeListener(SET_HOST_EVENT, listener)
          console.debug(`Resolving request with host: ${host}`)
          resolve(host)
        }
      }
      this._setHostEmitter.addListener(SET_HOST_EVENT, listener)
    })
  }

  async makeRequest<Args, Options, Output>(
    args: Args,
    options: Options,
    resource: Resource<Args, Options, Output>
  ): Promise<Result<Output, Error>> {
    const host = await this._getHost()
    const query = resource.queryBuilder(args, options, this._currentUserId)
    const endpoint = this._constructUrl(
      host,
      query.path,
      query.queryParams,
      resource.isFull
    )
    console.log({ endpoint })
    const res = await fetch(endpoint)
    const json = await res.json()
    const decoded = resource.responseType.decode(json)
    if (isRight(decoded)) {
      return successResult(decoded.right)
    } else {
      console.log('Got error!')
      console.log('Error: ' + JSON.stringify(decoded.left))
      // TODO: handle multiple errors!
      return errorResult(new Error(decoded.left[0].message))
    }
  }

  _constructUrl(
    host: string,
    path: string,
    params: QueryParams,
    isFull: boolean
  ) {
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
    return `${host}/${prefix}/${path}${queryString ? `?${queryString}` : ''}`
  }
}
