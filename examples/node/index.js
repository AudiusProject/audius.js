const Audius = require('../../dist/index.js')
const ffmpeg = require('ffmpeg')

const discordToken = "NzA0NDM1NzkzMjU0NDE2NTA0.XqdHEg.QIU5KiQh6Tj5beNOccQfknGQ_AY"
const Discord = require('discord.js')
const client = new Discord.Client()
client.login(discordToken)
client.once('ready', () => {
  console.log('Bot is ready and logged in!')
})

const audius = new Audius({ recordPlays: true })
client.on('message', async message => {
  if (message.author.bot) return
  if (!message.content.startsWith("~")) return
  if (message.content.startsWith("~stop")) {
    console.log("stopping")
    const voiceChannel = message.member.voice.channel
    const connection = await voiceChannel.join()
    if (connection.dispatcher) connection.dispatcher.end()
  } else if (message.content.startsWith("~play")) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.channel.send("U need to be in a voice channel bro")
    const connection = await voiceChannel.join()
    console.log('Got connection')
    const manifest = await audius.getTrackManifest(46420)
    console.log('Got manifest')
    const playing = connection.play(manifest)
    playing
      .on("error", error => console.log("did error" + error))
      .on("finish", () => console.log("Finished"))
      .on("start", () => console.log("started"))
  } else {
    message.channel.send("I am alive, Hal")
  }
})

