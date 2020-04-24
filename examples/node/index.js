const Audius = require('../../dist/index.js')

console.log(process.env.NODE_ENV)
return

console.log('LOADED!')

const audius = new Audius()
audius.getTrackManifest(1).then(m => {
  console.log(m)
})
