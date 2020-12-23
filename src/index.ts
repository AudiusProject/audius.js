import btoa from 'btoa'
import { RESTClient } from './core/RESTClient'
import AudiusLibs from '@audius/libs'
import makeLibsConfig from './libs/config'
import UserRoutes from './route-groups/UserRoutes'

// Minor hack alert:
// `btoa` is required as a global
// for `Axios` to work properly, due to
// `XMLHttpRequest exported from web3
// causing axios to think we're in a browser environment.
// @ts-ignore
global.btoa = btoa

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
      this._libs = libs
    } else {
      // Create libs as necessary
      const config = makeLibsConfig()
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
    this._restClient.setLibsInitializationState('initialized')
  }

  async _initLibs() {
    await this._libs.init()
  }
}

export default Audius

// 'EXAMPLE' running it:
const a = new Audius({
  initialDiscoveryNode: 'https://discoveryprovider.audius.co'
})

a.init().then(() => {
  console.log('initted!')
  a.Users.getFollowers({ userId: 'nVvkb' }).then(res => {
    if (res.error) {
      console.log({ error: res.error })
    } else {
      console.log('GOT LIBS DATA!')
    }
  })
})

a.Users.getFollowers({ userId: 'nVvkb' }).then(res => {
  if (res.error) {
    console.log(res.error)
  } else {
    console.log('GOT FETCH DATA!')
  }
})
