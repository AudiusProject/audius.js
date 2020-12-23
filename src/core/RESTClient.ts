import { Resource, QueryParams } from '../resources/Resource'
import { isRight } from 'fp-ts/lib/Either'
import fetch, { Response } from 'node-fetch'
import { Result, successResult, errorResult } from '../types/Result'
import EventEmitter from 'eventemitter3'
import { ConnectionError, UnknownError } from '../core/Errors'
import { LibsInitializationState } from 'index'
import AudiusLibs from '@audius/libs'

const LIBS_INIT_EVENT = 'LIBS_INITTED'

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
  _libsInitializedEmitter: EventEmitter
  _libsInitializationState: LibsInitializationState
  _libs: AudiusLibs

  constructor({
    host,
    currentUserId,
    libsInitializationState,
    libs
  }: {
    host?: string
    currentUserId?: string
    libsInitializationState: LibsInitializationState
    libs: AudiusLibs
  }) {
    this._host = host
    this._currentUserId = currentUserId
    this._libsInitializedEmitter = new EventEmitter()
    this._libs = libs
    this._libsInitializationState = libsInitializationState
  }

  setLibsInitializationState(state: LibsInitializationState) {
    this._libsInitializationState = state
    if (state === 'initialized') {
      this._libsInitializedEmitter.emit(state)
    }
  }

  // setHost(host: string) {
  //   this._host = host
  //   this._setHostEmitter.emit(SET_HOST_EVENT)
  // }

  async _awaitLibsInit(): Promise<void> {
    // If we're already initted, immediately return
    if (this._libsInitializationState === 'initialized') return

    // Otherwise, return when we get emitted init event
    return new Promise(resolve => {
      const listener = () => {
        this._libsInitializedEmitter.removeListener(LIBS_INIT_EVENT, listener)
        console.debug('Libs initted!')
        resolve()
      }
      this._libsInitializedEmitter.addListener(LIBS_INIT_EVENT, listener)
    })
  }

  async makeRequest<Args, Options, Output>(
    args: Args,
    options: Options,
    resource: Resource<Args, Options, Output>
  ): Promise<Result<Output, Error>> {
    const query = resource.queryBuilder(args, options, this._currentUserId)

    let json: any
    if (this._libsInitializationState === 'uninitialized' && this._host) {
      const endpoint = this._constructUrl(
        this._host,
        query.path,
        query.queryParams,
        resource.isFull
      )
      let res: Response
      try {
        console.debug('Calling via fetch route')
        res = await fetch(endpoint)
      } catch (e) {
        return errorResult(
          new ConnectionError({
            message: `Cannot connect to server: ${endpoint}`
          })
        )
      }
      json = await res.json()
      if (!res.ok) {
        const error = resource.errorBuilder(res.status, json)
        return errorResult(error)
      }
    } else {
      // Otherwise, await libs init
      console.debug('Calling via libs route')
      await this._awaitLibsInit()
      const path = this._formatPath(query.path, resource.isFull)
      const data = await this._libs.discoveryProvider._makeRequest(
        {
          endpoint: path,
          queryParams: query.queryParams
        },
        true /* retry */,
        false /* shouldUnnestData */
      )
      // TODO: handle this !data case!
      // if (!data) return null
      json = data
    }
    const decoded = resource.responseType.decode(json)
    if (isRight(decoded)) {
      return successResult(decoded.right)
    } else {
      return errorResult(
        new UnknownError({ message: 'An encoding error has occurred' })
      )
    }
  }

  _formatPath(path: string, isFull: boolean) {
    return `/v1${isFull ? '/full' : ''}/${path}`
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
