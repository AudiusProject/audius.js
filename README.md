# Install

```
npm install @audius/audius.js
```

# Usage

```
const Audius = require('audius.js')

// Create a new instance of the Audius client
const audius = new Audius({
  /* Give this client a descriptive ID describing this application. */
  analyticsId: 'audius_discord_bot'

  /* Set audius.js to record plays.
   * Optional, defaults to true in prod env. */
  recordPlays: true,
})

// Return metadata for some track
const trackId = '12345'
try {
  const metadata = await audius.getTrackMetadata(trackId)
  console.log(metadata.title)
} catch (err) {
  ...
}

// Return a streamable URI for some track,
// do something fun with it.
try {
  const uri = await audius.getTrackDataURI(trackId)

  // Pass it off to a Discord client - fun!
  discordVoiceConnection.play(uri)
} catch (err) {
  ...
}
```

# Develop

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
