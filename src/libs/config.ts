import AudiusLibs from '@audius/libs'

const TOKEN_ADDRESS = "0xADEf65C0f6a30Dcb5f88Eb8653BBFe09Bf99864f"
const ETH_REGISTRY_ADDRESS = "0xb2be26Ca062c5D74964921B80DE6cfa28D9A36c0"
const ETH_PROVIDER_URL = 'https://eth-mainnet.alchemyapi.io/jsonrpc/iSnek4T02BFCUEkcPGKo0eEY1aWLJgxF'
const ETH_OWNER_WALLET = "0xe886a1858d2d368ef8f02c65bdd470396a1ab188"
const IDENTITY_SERVICE = "https://identityservice.audius.co"

const DISCOVERY_PROVIDER_WHITELIST = new Set([
  "https://discoveryprovider.audius.co",
  "https://discoveryprovider2.audius.co",
  "https://discoveryprovider3.audius.co"
])

const libsConfig = {
  ethWeb3Config: AudiusLibs.configEthWeb3(
    TOKEN_ADDRESS,
    ETH_REGISTRY_ADDRESS,
    ETH_PROVIDER_URL,
    ETH_OWNER_WALLET
  ),
  discoveryProviderConfig: AudiusLibs.configDiscoveryProvider(
    false,
    new Set(DISCOVERY_PROVIDER_WHITELIST)
  ),
  identityServiceConfig: AudiusLibs.configIdentityService(IDENTITY_SERVICE),
  isServer: true,
}

export default libsConfig
