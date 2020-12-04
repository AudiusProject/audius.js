import * as t from 'io-ts'

import { User } from '../models/Users'

export const UserResponse = t.partial({ data: User })
export type UserResponse = t.TypeOf<typeof UserResponse>

export const UserSearch = t.partial({ data: t.array(User) })
export type UserSearch = t.TypeOf<typeof UserSearch>
