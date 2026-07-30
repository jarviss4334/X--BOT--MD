const {Sparky, isPublic,uploadMedia,handleMediaUpload} = require("../lib");
const {getString, appendMp3Data, convertToMp3, addExifToWebP, getBuffer, getJson} = require('./pluginsCore');
const googleTTS = require('google-tts-api');
const config = require('../config.js');
const lang = getString('converters');
const fs = require("fs");
const PDFDocument = require("pdfkit"); 
const { PDFDocument: PDFLib } = require("pdf-lib");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path;
const QRCode = require("qrcode");
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);




Sparky({
    name: "url",
    fromMe: true,
    desc: "",
    category: "converters",
  }, async ({ args, m }) => {
    if (!m.quoted) {
      return m.reply('Reply to an Image/Video/Audio');
    }
    try {
        await m.react('☠️');
      const mediaBuffer = await m.quoted.download();
      const mediaUrl = await handleMediaUpload(mediaBuffer);
      await m.react('🍻');
      m.reply(mediaUrl);
    } catch (error) {
        await m.react('❌');
      m.reply('An error occurred while uploading the media(umbi).');
    }
  });

Sparky(
  {
    name: "trt",
    fromMe: true,
    desc: "Translate text to a given language",
    category: "converters",
  },
  async ({ client, m, args }) => {
    try {
      if (!args) return await m.reply('_Reply to any text with lang_\n_Eg : trt ml_');
      const trtxt = m.quoted?.text;
      const trtlang = args;
      const trt = await getJson(`${config.API}/api/search/translate?text=${trtxt}&lang=${trtlang}`)
      return m.reply(`${trt.result}`);
    } catch (e) {
      console.error(e);
    }
  }
);

Sparky(
    {
        name: "👀👀",
        fromMe: true,
        category: "converters",
        desc: "Resends the view Once message"
    },
    async ({
        m, client 
    }) => {
        if (!m.quoted) {
            return m.reply("_Reply to ViewOnce Message !_");
        }
        try {
            m.react("☠️");
		let buff = await m.quoted.download();
		return await m.sendFile(buff);
        } catch (e) {
            return m.react("❌");
        } 
    });

Sparky({
		name: "sticker",
		fromMe: isPublic,
		category: "converters",
		desc: lang.STICKER_DESC
	},
	async ({
		m,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.imageMessage || m.quoted.message.videoMessage)) {
			return await m.reply(lang.STICKER_ALERT);
		}
		await m.react('☠️');
		await m.sendMsg(m.jid, await m.quoted.download(), {
			packName: args.split(';')[0] || config.STICKER_DATA.split(';')[0],
			authorName: args.split(';')[1] || config.STICKER_DATA.split(';')[1],
			quoted: m
		}, "sticker");
		return await m.react('🍻');
	});


Sparky({
		name: "mp3",
		fromMe: isPublic,
		category: "converters",
		desc: lang.MP3_DESC
	},
	async ({
		m,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.audioMessage || m.quoted.message.videoMessage || (m.quoted.message.documentMessage && m.quoted.message.documentMessage.mimetype === 'video/mp4'))) {
			return await m.reply(lang.MP3_ALERT);
		}
		await m.react('☠️');
		await m.sendMsg(m.jid, await convertToMp3(await m.quoted.download()), { mimetype: "audio/mpeg", quoted: m }, 'audio');
		return await m.react('🍻');
	});


Sparky({
		name: "take",
		fromMe: isPublic,
		category: "converters",
		desc: lang.TAKE_DESC
	},
	async ({
		m,
		args,
		client
	}) => {
		if (!m.quoted || !(m.quoted.message.stickerMessage || m.quoted.message.audioMessage || m.quoted.message.imageMessage || m.quoted.message.videoMessage)) return m.reply('reply to a sticker/audio');
		await m.react('☠️');
        if (m.quoted.message.stickerMessage || m.quoted.message.imageMessage || m.quoted.message.videoMessage) {
            args = args || config.STICKER_DATA;
            return await m.sendMsg(m.jid, await m.quoted.download(), {
			packName: `${args.split(';')[0]}` || `${config.STICKER_DATA.split(';')[0]}`,
			authorName: `${args.split(';')[1]}` || `${config.STICKER_DATA.split(';')[1]}`,
			quoted: m
		}, "sticker");
        } else if (m.quoted.message.audioMessage) {
            const opt = {
                title: args ? args.split(/[|,;]/) ? args.split(/[|,;]/)[0] : args : config.AUDIO_DATA.split(/[|,;]/)[0] ? config.AUDIO_DATA.split(/[|,;]/)[0] : config.AUDIO_DATA,
                body: args ? args.split(/[|,;]/)[1] : config.AUDIO_DATA.split(/[|,;]/)[1],
                image: (args && args.split(/[|,;]/)[2]) ? args.split(/[|,;]/)[2] : config.AUDIO_DATA.split(/[|,;]/)[2]
            }
            const Data = await AudioData(await convertToMp3(await m.quoted.download()), opt);
            return await m.sendMsg(m.jid ,Data,{
                mimetype: 'audio/mpeg'
            },'audio');
        }
		await m.react('🍻');
	});


Sparky({
		name: "photo",
		fromMe: isPublic,
		category: "converters",
		desc: lang.PHOTO_DESC
	},
	async ({
		m
	}) => {
		if (!m.quoted || !m.quoted.message.stickerMessage || m.quoted.message.stickerMessage.isAnimated) {
			return await m.reply(lang.PHOTO_ALERT);
		}
		await m.react('☠️');
		await m.sendMsg(m.jid, await m.quoted.download(), {
			quoted: m
		}, "image");
		return await m.react('🍻');
	});

	Sparky(
		{
			name: "tts",
			fromMe: isPublic,
			category: "converters",
			desc: "text to speech"
		},
		async ({
			m, client, args
		}) => {
			if (!args) {
				m.reply('_Enter Query!_')
			} else {
				let [txt,
					lang] = args.split`:`
				const audio = googleTTS.getAudioUrl(`${txt}`, {
					lang: lang || "ml",
					slow: false,
					host: "https://translate.google.com",
				})
				client.sendMessage(m.jid, {
					audio: {
						url: audio,
					},
					mimetype: 'audio/mpeg',
					ptt: false,
					fileName: `${'tts'}.mp3`,
				}, {
					quoted: m,
				})
	
			}
		});

Sparky(
  {
    name: "doc",
    fromMe: isPublic,
    category: "converters",
    desc: "Convert replied media to document",
  },
  async ({ m, client, args }) => {
    try {
      if (
        !m.quoted ||
        !(
          m.quoted.message.imageMessage ||
          m.quoted.message.videoMessage ||
          m.quoted.message.audioMessage ||
          m.quoted.message.documentMessage ||
          m.quoted.message.stickerMessage
        )
      ) {
        return await m.reply("This isn't a doc my nigga");
      }

      await m.react("☠️");
      const buffer = await m.quoted.download();
      const mimetype =
        m.quoted.message.imageMessage?.mimetype ||
        m.quoted.message.videoMessage?.mimetype ||
        m.quoted.message.audioMessage?.mimetype ||
        m.quoted.message.documentMessage?.mimetype ||
        "application/octet-stream";
      let filename = args || "xbotmd";

      if (!filename.includes(".")) {
        const ext = mimetype.split("/")[1] || "bin";
        filename += `.${ext}`;
      }

      await client.sendMessage(
        m.jid,
        {
          document: buffer,
          mimetype,
          fileName: filename,
        },
        { quoted: m }
      );

      await m.react("🍻");

    } catch (err) {
      console.log(err);
      await m.react("❌");
      m.reply("Error converting media 😅");
    }
  }
);
Sparky(
  {
    name: "returnog",
    fromMe: isPublic,
    category: "converters",
    desc: "Return document back to original media",
  },
  async ({ m, client }) => {
    try {
      const quoted = m.quoted;
      if (!quoted || !quoted.message?.documentMessage)
        return m.reply("Reply to a document message bro");
      const mime = quoted.message.documentMessage.mimetype;
      const buffer = await quoted.download();
      let type = "document";
      if (mime.startsWith("image")) type = "image";
      else if (mime.startsWith("video")) type = "video";
      else if (mime.startsWith("audio")) type = "audio";
      await m.sendMsg(
        m.jid,
        buffer,
        { mimetype: mime, quoted: m },
        type
      );

    } catch (err) {
      console.log(err);
      m.reply("Error restoring media 😅");
    }
  }
);


Sparky(
		{
			name: "say",
			fromMe: isPublic,
			category: "converters",
			desc: "text to speech"
		},
		async ({
			m, client, args
		}) => {
			if (!args) {
				m.reply('_Enter Query!_')
			} else {
				let [txt,
					lang] = args.split`:`
				const audio = googleTTS.getAudioUrl(`${txt}`, {
					lang: lang || "en",
					slow: false,
					host: "https://translate.google.com",
				})
				client.sendMessage(m.jid, {
					audio: {
						url: audio,
					},
					mimetype: 'audio/mpeg',
					ptt: true,
					fileName: `${'tts'}.mp3`,
				}, {
					quoted: m,
				})
	
			}
		});


Sparky({
    name: "returntext",
    fromMe: isPublic,
    category: "ai",
    desc: "Extract formatted text (OCR.space + fallback)"
}, async ({ m, client }) => {
    if (!m.quoted || !m.quoted.message.imageMessage)
        return m.reply("❌ Reply to an image");
    try {
        await m.react("☠️");
        const buffer = await m.quoted.download();
        let text = "";
        try {
            const res = await axios.post(
                "https://api.ocr.space/parse/image",
                {
                    base64Image: "data:image/jpeg;base64," + buffer.toString("base64"),
                    language: "eng",
                    isOverlayRequired: false
                },
                {
                    headers: {
                        apikey: "helloworld"
                    },
                    timeout: 15000
                }
            );
            text = res.data?.ParsedResults?.[0]?.ParsedText || "";
        } catch (err) {
            console.log("OCR.space failed → fallback");
        }
        if (!text || !text.trim()) {
            const { data } = await Tesseract.recognize(buffer, "eng");
            text = data.text;
        }
        if (!text || !text.trim())
            return m.reply("❌ No text found");
        function formatText(input) {
            return input
                .replace(/\r/g, "")
                .replace(/[ \t]+/g, " ")
                .replace(/\n{3,}/g, "\n\n")
                .replace(/([a-z])\n([a-z])/g, "$1 $2")
                .replace(/\s+([.,!?])/g, "$1")
                .split("\n")
                .map(line => {
                    let l = line.trim();
                    if (!l) return "";
                    if (l.length < 40 && /^[A-Z0-9\s]+$/.test(l)) {
                        return `\n🔹 ${l}\n`;
                    }

                    return l;
                })
                .join("\n")
                .trim();
        }
        const cleanText = formatText(text);
        await m.react("🍻");
        if (cleanText.length > 4000) {
            const filePath = "./ocr.txt";
            fs.writeFileSync(filePath, cleanText);
            return await client.sendMessage(m.jid, {
                document: fs.readFileSync(filePath),
                mimetype: "text/plain",
                fileName: "ocr.txt"
            }, { quoted: m });
        }
        await m.reply(`➤ RESULT:\n\n${cleanText}`);
    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error extracting text 😅");
    }
});

Sparky({
    name: "trim",
    fromMe: true,
    category: "converters",
    desc: "Trim audio (reply with start;end in seconds)"
}, async ({ m, args }) => {

    if (!m.quoted || !m.quoted.message.audioMessage)
        return m.reply("Reply to an audio");

    if (!args.includes(";"))
        return m.reply("Use format: trim start;end (e.g., trim 0;30)");

    const [start, end] = args.split(";").map(Number);

    if (isNaN(start) || isNaN(end))
        return m.reply("Invalid numbers");

    try {
        await m.react("☠️");

        const input = "./input.mp3";
        const output = "./trimmed.mp3";

        const buffer = await m.quoted.download();
        fs.writeFileSync(input, buffer);

        await new Promise((resolve, reject) => {
            ffmpeg(input)
                .setStartTime(start)
                .setDuration(end - start)
                .output(output)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        await m.sendMsg(m.jid, fs.readFileSync(output), {
            mimetype: "audio/mpeg",
            quoted: m
        }, "audio");

        fs.unlinkSync(input);
        fs.unlinkSync(output);

        await m.react("🍻");

    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Trim failed");
    }
});

const audioQueue = {};
Sparky({
    name: "addmp3",
    fromMe: true,
    category: "converters",
    desc: "Add audio to merge queue"
}, async ({ m }) => {

    if (!m.quoted || !m.quoted.message.audioMessage)
        return m.reply("Reply to an audio");

    try {
        await m.react("☠️");

        const buffer = await m.quoted.download();

        if (!audioQueue[m.jid]) audioQueue[m.jid] = [];

        audioQueue[m.jid].push(buffer);

        await m.react("🍻");
        m.reply(`➤ Added to queue (${audioQueue[m.jid].length})`);

    } catch (err) {
        console.log(err);
        await m.react("❌");
    }
});

Sparky({
    name: "showmp3",
    fromMe: true,
    category: "converters",
    desc: "Show audio queue"
}, async ({ m }) => {

    const q = audioQueue[m.jid] || [];

    if (!q.length)
        return m.reply("➤ Queue empty");

    let msg = "╭━━━〔 audio queue 〕━━>\n┃\n";

    q.forEach((_, i) => {
        msg += `┃• track ${i + 1}\n`;
    });

    msg += "╰━━━━━━━━━━━━━>";

    m.reply(msg);
});

Sparky({
    name: "mergemp3",
    fromMe: true,
    category: "converters",
    desc: "Merge all queued audios"
}, async ({ m }) => {

    const q = audioQueue[m.jid];

    if (!q || q.length < 2)
        return m.reply("Need at least 2 audios");

    try {
        await m.react("☠️");

        const files = [];

        // save all audios
        q.forEach((buf, i) => {
            const file = `./tmp_${i}.mp3`;
            fs.writeFileSync(file, buf);
            files.push(file);
        });

        const output = "./merged.mp3";

        await new Promise((resolve, reject) => {
            const command = ffmpeg();

            files.forEach(f => command.input(f));

            command
                .on("error", reject)
                .on("end", resolve)
                .mergeToFile(output);
        });

        await m.sendMsg(
            m.jid,
            fs.readFileSync(output),
            { mimetype: "audio/mpeg", quoted: m },
            "audio"
        );
        files.forEach(f => fs.unlinkSync(f));
        fs.unlinkSync(output);

        delete audioQueue[m.jid];

        await m.react("🍻");

    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Merge failed");
    }
});

Sparky({
    name: "clearmp3",
    fromMe: true,
    category: "converters",
    desc: "Clear audio queue"
}, async ({ m }) => {

    delete audioQueue[m.jid];
    m.reply("➤ Queue cleared");
});

Sparky({
    name: "returnqr",
    fromMe: isPublic,
    category: "converters",
    desc: "Generate a UPI payment QR"
}, async ({ m, client, args }) => {
    if (!args)
        return m.reply("Usage:\nreturnqr 250");
    const amount = Number(args);
    if (isNaN(amount) || amount <= 0)
        return m.reply("Enter a valid amount.");
    const upiId = "thejus0644p-1@oksbi";
    const payeeName = "Thejus";
    const upi = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    const qr = await QRCode.toBuffer(upi);
    await client.sendMessage(
        m.jid,
        {
            image: qr,
            caption: `💳 Scan to pay ₹${amount}`
        },
        { quoted: m }
    );

});

Sparky({
    name: "sendinr",
    fromMe: isPublic,
    category: "converters",
    desc: "Generate UPI payment intent link"
}, async ({ m, args }) => {

    if (!args)
        return m.reply("Usage:\nsendinr amount,upiid\n\nExample:\nsendinr 250,test@okaxis");

    const [amount, upiId] = args.split(",").map(x => x.trim());

    if (!amount || isNaN(amount))
        return m.reply("Invalid amount.");

    if (!upiId)
        return m.reply("Please provide a valid UPI ID.");

    const intent = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${Number(amount)}&cu=INR`;

    await m.reply(
`💳 *UPI Payment Request*

💰 Amount: ₹${amount}
🏦 UPI ID: ${upiId}

Tap the link below to pay:

${intent}`
    );

});
