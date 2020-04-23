/**
 * Exposes an opinionated AudiusLibs
 * @packageDocumentation
 * @ignore
 */

import AudiusLibs from '@audius/libs'
import { EventEmitter } from 'events'

// Configuration
const TOKEN_ADDRESS = 0xADEf65C0f6a30Dcb5f88Eb8653BBFe09Bf99864f
const ETH_REGISTRY_ADDRESS = 0xb2be26Ca062c5D74964921B80DE6cfa28D9A36c0
const ETH_PROVIDER_URL = 'https://mainnet.infura.io/v3/c569c6faf4f14d15a49d0044e7ddd668'
const ETH_OWNER_WALLET = 0xe886a1858d2d368ef8f02c65bdd470396a1ab188

const INITIALIZED = 'INITIALIZED'

/**
 * Singleton wrapper for Audius Libs.
 * Currently only supports read operations.
 * Initialized on start-up.
 */
const libs = new AudiusLibs({
  ethWeb3Config: AudiusLibs.configEthWeb3(
    TOKEN_ADDRESS,
    ETH_REGISTRY_ADDRESS,
    ETH_PROVIDER_URL,
    ETH_OWNER_WALLET
  ),
  discoveryProviderConfig: AudiusLibs.configDiscoveryProvider(
    true
  )
})

const ee = new EventEmitter()

let hasInitialized = false

/**
 * Initialize audius service libs
 */
const init = async () => {
  await libs.init()
  ee.emit(INITIALIZED)
  hasInitialized = true
}
// Initialize immediately on start
init()

/**
 * Wait for libs to finish initializing
 * before resolving
 */
const awaitInit = async () => {
  return new Promise(resolve => {
    if (hasInitialized) resolve()
    ee.on(INITIALIZED, resolve)
  })
}

/**
 * Provider for libs methods.
 * Ensures that libs is connected before
 * invoking `callback`
 */
export const provide = async (
  callback: (...args: any) => void
) => async () => {
  await awaitInit()
  return callback
}

export default libs
