import { RESTClient } from '../core/RESTClient'
import {
  getUserFollowsResource,
  GetUserFollowsArgs,
  GetUserFollowsOptions
} from '../resources/GetUserFollowers'

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

export default UserRoutes
