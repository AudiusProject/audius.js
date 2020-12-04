import * as t from 'io-ts'

export const Repost = t.type({
  repost_item_id: t.string,
  repost_type: t.string,
  user_id: t.string
})
export type Repost = t.TypeOf<typeof Repost>

export const Favorite = t.type({
  favorite_item_id: t.string,
  favorite_type: t.string,
  user_id: t.string
})
export type Favorite = t.TypeOf<typeof Favorite>
