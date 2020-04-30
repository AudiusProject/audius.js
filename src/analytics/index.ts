import Analytics from 'analytics-node'
import { ID } from 'shared/types/common'
import _ from 'lodash'

const SEGMENT_WRITE_KEY = '5TPGR7lqFqzVZ8D2qgB6curM9XlTr0n6'
const SOURCE = 'audius.js'

const analytics = new Analytics(SEGMENT_WRITE_KEY)

enum EventType {
  PLAYBACK_PLAY = 'Playback: Play',
  LISTEN = 'Listen'
}

type BaseEvent = { source: string }

type ListenEvent = {
  type: EventType.LISTEN
  id: string
} & BaseEvent

type PlayEvent = {
  type: EventType.PLAYBACK_PLAY
  id: string
} & BaseEvent

type AllEvents = ListenEvent | PlayEvent

const track = (userId: string, event: AllEvents) => {
  analytics.track(
    {
      userId,
      event: event.type,
      properties: _.omit(event, ['type'])
    },
    err => {
      if (err) console.warn(`Analytics error: ${err.message}`)
    }
  )
}

export const identify = (userId: string) => {
  analytics.identify({ userId })
}

export const recordPlayEvent = (trackId: ID, userId: string) => {
  track(userId, {
    type: EventType.PLAYBACK_PLAY,
    id: `${trackId}`,
    source: SOURCE
  })
}

export const recordListenEvent = (trackId: ID, userId: string) => {
  track(userId, { type: EventType.LISTEN, id: `${trackId}`, source: SOURCE })
}
