import btoa from 'btoa'
import {
  getUserFollowsResource,
  GetUserFollowsArgs,
  GetUserFollowsOptions
} from 'resources/GetUserFollowers'
import { RESTClient } from './core/RESTClient'
import AudiusLibs from '@audius/libs'
import makeLibsConfig from './libs/config'

// Minor hack alert:
// `btoa` is required as a global
// for `Axios` to work properly, due to
// `XMLHttpRequest exported from web3
// causing axios to think we're in a browser environment.
// @ts-ignore
global.btoa = btoa

class UserRoutes {
  _restClient: RESTClient

  constructor(restClient: RESTClient) {
    this._restClient = restClient
  }

  async getFollowers(
    args: GetUserFollowsArgs,
    options: GetUserFollowsOptions = {}
  ) {
    const resource = getUserFollowsResource
    return this._restClient.makeRequest(args, options, resource)
  }
}

type AudiusArgs = {
  libs?: AudiusLibs
  initialDiscoveryNode?: string
}

export type LibsInitializationState = 'initialized' | 'uninitialized'

/**
 * Top level class, orchestrates managers responsible
 * for performing more specific operations
 */
class Audius {
  _restClient: RESTClient
  _libs: AudiusLibs
  _libsInitializationState: LibsInitializationState

  Users: UserRoutes

  constructor({ libs, initialDiscoveryNode }: AudiusArgs = {}) {
    this._libsInitializationState = 'uninitialized'

    if (libs) {
      // If injected libs, need to get the
      // current DP endpoint, and monkeypatch the selection
      // callback :/
      this._libs = libs
      const currentHost = libs.discoveryProvider.discoveryProviderEndpoint
      const selectionCallback = (endpoint: string) => {
        this._setNewEndpoint(endpoint)
        libs.discoveryProvider.serviceSelector.selectionCallback(endpoint)
      }
      libs.discoveryProvider.serviceSelector.selectionCallback = selectionCallback
      this._restClient.setHost(currentHost)
    } else {
      // Create libs as necessary
      const config = makeLibsConfig(this._setNewEndpoint)
      this._libs = new AudiusLibs(config)
    }

    this._restClient = new RESTClient({
      host: initialDiscoveryNode,
      libsInitializationState: 'uninitialized',
      libs: this._libs
    })
    this.Users = new UserRoutes(this._restClient)
  }

  async init() {
    console.log('initting')
    await this._initLibs()
    this._libsInitializationState = 'initialized'
    this._restClient.libsInitializationState = 'initialized'
    // TODO: what if the libs you passed in as already initted? We good?
  }

  async _initLibs() {
    await this._libs.init()
  }

  _setNewEndpoint = (endpoint: string) => {
    this._restClient.setHost(endpoint)
  }
}

export default Audius

// TODO:
// handle currentUserId
// retries
// errors
// cosmetic - host vs endpoint?
// .env for lib vars?
// - should response.data be optional? rn it is, seems like it shouldn't be...
// To test:
//  - does injecting your own libs + monkeypatching actually work?

const a = new Audius({
  initialDiscoveryNode: 'https://discoveryprovider.audius.co'
})
a.init().then(() => {
  console.log('initted!')
  setTimeout(() => {
    a.Users.getFollowers({ userId: 'nVvkb' }).then(res => {
      if (res.error) {
        console.log({ error: res.error })
      } else {
        console.log('GOT LIBS DATA!')
        // console.log({ data: res.data![0] })
      }
    })
  }, 5000)
})
a.Users.getFollowers({ userId: 'nVvkb' }).then(res => {
  if (res.error) {
    console.log(res.error)
  } else {
    console.log('GOT FETCH DATA!')
    // console.log({ data: res.data![0] })
  }
})
