# audius.js
`Audius.js` offers a dead simple Javascript client for interacting with the Audius protocol.

This package is early and experimental. You may experience bugs and frequent changes.

**`Audius.js` currently only works in `Node` environments. It will not work in a browser.**

Under the hood, `audius.js` leverages [Audius Libs](https://github.com/AudiusProject/audius-protocol/tree/master/libs), a much lower level client, to interact with the network.


# Functionality

`Audius.js` currently supports streaming tracks and retrieving track metadata.

[`Audius.js` is fully documented.](https://audiusproject.github.io/audius.js/)

To stream a track, `Audius.js` provides an [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) manifest encoded in a [data-URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs). This URL should be consumable by clients that can stream HLS.


# Installation

```
npm install @audius/audius.js
```


# Usage

```
const Audius = require('@audius/audius.js')

// Create a new instance of the Audius client
const audius = new Audius({
  /* Give this client a descriptive ID describing this application. */
  analyticsId: 'audius_discord_bot'
})

// Return metadata for some track
const trackId = '12345'
try {
  const metadata = await audius.getTrackMetadata(trackId)
  console.log(metadata.title)
} catch (err) {
  ...
}

// Return a streamable URL for some track,
// do something fun with it.
try {
  const url = await audius.getAudioStreamURL(trackId)

  // Pass it off to a Discord client - fun!
  discordVoiceConnection.play(url)
} catch (err) {
  ...
}
```


# Notes

## TrackIds
Many of the methods accept `trackIds`.
`TrackIds` may be found by stripping off the trailing digits from an Audius track URL: e.g. `"https://audius.co/lido/life-of-peder-part-one-11786" => 11786`

# Developing

## Linting
`Audius.js` uses [ESLint](https://eslint.org/) to lint as pre-commit hook. ESLint is configured with both [StandardJS](https://standardjs.com/) and [Prettier](https://prettier.io/) settings.

**It's highly recommended to turn on auto-fixes on save in your editor of choice.**
In VSCode, you can install the [ESLint Extension](https://github.com/microsoft/vscode-eslint), and then add the following code
to your settings.json:
```
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
```

## Commands
```
// Compile the lib in watch mode
npm run start
```

```
// Compile the lib once.
npm run build
```

```
// Compile docs for the lib.
npm run docs
```
