import { Resource, QueryParams } from '../resources/Resource'
import { isRight } from 'fp-ts/lib/Either'
import fetch, { Response } from 'node-fetch'
import { Result, successResult, errorResult } from '../types/Result'
import EventEmitter from 'eventemitter3'
import { ConnectionError, UnknownError } from '../core/Errors'
import { LibsInitializationState } from 'index'
import AudiusLibs from '@audius/libs'

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
  libsInitializationState: LibsInitializationState
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
    this._setHostEmitter = new EventEmitter()
    this._libs = libs

    this.libsInitializationState = libsInitializationState
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
    const query = resource.queryBuilder(args, options, this._currentUserId)

    // const data = await window.audiusLibs.discoveryProvider._makeRequest(
    //   {
    //     endpoint: this._formatPath(path),
    //     queryParams: params
    //   },
    //   retry
    // )
    // if (!data) return null
    // // TODO: Type boundaries of API
    // return { data } as any

    let json: any
    if (this.libsInitializationState === 'uninitialized') {
      const host = await this._getHost()
      const endpoint = this._constructUrl(
        host,
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
      // TODO: what does libs actually return?
      console.debug('Calling via libs route')
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
