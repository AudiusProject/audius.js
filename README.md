# Install

```
npm install @audius/blueberry
```

# Usage

```
import { tracks, audio } from '@audius/blueberry'

const track = await tracks.get(123)
const audio = new audio.Stream(track)

// Play the audio (in a web browser)
audio.play()

// Do something with the streamable URL (e.g. discord bot)
audio.getURL()
```

# Develop

```
npm run start
```

```
npm run build
```

```
npm run docs
```