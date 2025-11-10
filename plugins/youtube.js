const {
  Sparky,
  isPublic,
  YtInfo,
  yts,
  yta,
  ytv
} = require("../lib");
const { getString, isUrl, convertToMp3 } = require('./pluginsCore');
const fetch = require('node-fetch');
const lang = getString('download');


Sparky({
  name: "yts",
  fromMe: isPublic,
  category: "youtube",
  desc: "search in youtube"
}, async ({ m, client, args }) => {
  if (!args) return await m.reply(lang.NEED_Q);
  if (await isUrl(args)) {
    const yt = await YtInfo(args);
    return await client.sendMessage(m.jid, { image: { url: yt.thumbnail }, caption: "*title :* " + yt.title + "\n*author :* " + yt.author + "\n*url :* " + args + "\n*video id :* " + yt.videoId });
  } else {
    const videos = await yts(args);
    const result = videos.map(video => `*🏷️ Title :* _*${video.title}*_\n*📁 Duration :* _${video.duration}_\n*🔗 Link :* _${video.url}_`);
    return await m.reply(`\n\n_*Result Of ${args} 🔍*_\n\n` + result.join('\n\n'))
  }
});

Sparky({
  name: "ytv",
  fromMe: isPublic,
  category: "youtube",
  desc: "Find details of a song"
},
  async ({
    m, client, args
  }) => {
    try {
      args = args || m.quoted?.text;
      if (!args) return await m.reply(lang.NEED_URL);
      if (!await isUrl(args)) return await m.reply(lang.INVALID_LINK);
      await m.react('☠️');
      const url = await ytv(args);
      await m.sendMsg(m.jid, url, { quoted: m }, "video")
      await m.react('🍻');
    } catch (error) {
      await m.react('❌');
      m.reply(error);
    }
  });

Sparky({
  name: "yta",
  fromMe: isPublic,
  category: "youtube",
  desc: "Find details of a song"
},
  async ({
    m, client, args
  }) => {
    try {
      args = args || m.quoted?.text;
      if (!args) return await m.reply(lang.NEED_URL);
      if (!await isUrl(args)) return await m.reply(lang.INVALID_LINK);
      await m.react('☠️');
      const url = await yta(args);
      await m.sendMsg(m.jid, url, { quoted: m, mimetype: 'audio/mpeg' }, "audio");
      await m.react('🍻');
    } catch (error) {
      await m.react('❌');
      m.reply(error);
    }
  });

Sparky({
  name: "play",
  fromMe: isPublic,
  category: "youtube",
  desc: "play a song"
},
  async ({
    m, client, args
  }) => {
    try {
      args = args || m.quoted?.text;
      if (!args) return await m.reply(lang.NEED_Q);
      await m.react('🦚');
      const play = (await yts(args))[0]
      await m.react('☠️');
      await m.reply(`Downloading ${play.title}`)
      const url = await yta(play.url);
      await m.sendMsg(m.jid, url, { quoted: m, mimetype: 'audio/mpeg' }, "audio");
      await m.react('🍻');
    } catch (error) {
      await m.react('❌');
      m.reply(error);
    }
  });

Sparky({
  name: "song",
  fromMe: isPublic,
  category: "youtube",
  desc: "play a song"
},
  async ({
    m, client, args
  }) => {
    try {
      args = args || m.quoted?.text;
      if (!args) return await m.reply(lang.NEED_Q);
      await m.react('🤖');
      const play = (await yts(args))[0]
      await m.react('☠️');
      await m.reply(`Downloading ${play.title}`)
      const url = await yta(play.url);
      await m.sendMsg(m.jid, url, { quoted: m, mimetype: 'audio/mpeg' }, "audio");
      await m.react('🍻');
    } catch (error) {
      await m.react('❌');
      m.reply(error);
    }
  });
