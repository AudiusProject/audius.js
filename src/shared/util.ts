/**
 * Utilies for helping generate HLS streams
 * @packageDocumentation
 * @ignore
 */

import { TrackSegment } from 'shared/types/track'
import btoa from 'btoa'

const FORMAT = '#EXTM3U'
const VERSION = '#EXT-X-VERSION:3'
const TARGET_DURATION = '#EXT-X-TARGETDURATION:'
const MEDIA_SEQUENCE = '#EXT-X-MEDIA-SEQUENCE:0'
const SEGMENT_HEADER = '#EXTINF:'
const STREAM_VARIANT_65K =
  '#EXT-X-STREAM-INF:TYPE=AUDIO,BANDWIDTH=65000,CODECS="mp4a.40.2"'
const ENDLIST = '#EXT-X-ENDLIST'

const TARGET_DURATION_VALUE = 6

/**
 * Generates an M3U8 manifest file
 * @param segments an array of segments with urls
 * @param ipfs gateway to retrieve segments from
 * @param prefetchedSegments optional segments that have local blob-like URLs for faster fetching.
 */
export const generateM3U8 = (
  segments: TrackSegment[],
  prefetchedSegments: string[] = [],
  gateway?: string
) => {
  let targetDuration = TARGET_DURATION_VALUE

  // Special case tracks that were segmented incorrectly and only have one segment
  // by setting the HLS target duration to that segment's duration (fixes Safari HLS issues).
  if (segments.length === 1) {
    targetDuration = Math.round(parseFloat(segments[0].duration))
  }

  let lines = [
    FORMAT,
    VERSION,
    `${TARGET_DURATION}${targetDuration}`,
    MEDIA_SEQUENCE
  ]

  lines = lines.concat(
    segments.map((segment, i) => {
      const link = prefetchedSegments[i]
        ? prefetchedSegments[i]
        : `${gateway}${segment.multihash}`
      // Write a CID directly to the manifest file so that the fragment
      // loader can customizably fetch the CID.
      return [`${SEGMENT_HEADER}${segment.duration}`, link].join('\n')
    })
  )

  lines.push(ENDLIST)
  return lines.join('\n')
}

/**
 * Generates a master m3u8 file containing m3u8 variants for each of the provided gateways
 * @param segments an array of segments with urls
 * @param gateways list of ipfs gateways, e.g. https://ipfs.io/ipfs/
 * @param prefetchedSegments optional segments that have local blob-like URLs for faster fetching.
 */
export const generateM3U8Variants = (
  segments: TrackSegment[],
  prefetchedSegments: string[] = [],
  gateways?: string[]
) => {
  const variants = gateways.map(gateway => {
    const variant = generateM3U8(segments, prefetchedSegments, gateway)

    return encodeURI(
      `data:application/vnd.apple.mpegURL;base64,${btoa(variant)}`
    )
  })

  const lines = [FORMAT, VERSION]

  variants.forEach(variant => {
    lines.push(STREAM_VARIANT_65K)
    lines.push(variant)
  })
  const m3u8 = lines.join('\n')

  // If there is native support for HLS (OSX Safari and iOS Safari), pass a data URI.
  // NOTE: Safari requires a resource URL to have an extension, so passing a createObjectURL for a blob
  // will not work.
  return encodeURI(`data:application/vnd.apple.mpegURL;base64,${btoa(m3u8)}`)
}

export const uuid = () => {
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/873856#873856
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // @ts-ignore
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}
