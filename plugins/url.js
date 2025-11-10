//=============[ EDIT HERE ✅ ]============
const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'bijobino';
const GITHUB_REPO = 'sparkyapi';
const GITHUB_BRANCH = 'main';
const VERCEL_DOMAIN = 'https://url.sparky.biz.id';

//=============[ NO NEED TO EDIT HERE ❌ ]============
const { Sparky, isPublic } = require("../lib");
const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
function makeid(num = 6) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characters9 = characters.length;
  for (var i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
}
Sparky({
    name: "url",
    fromMe: true,
    category: "converters",
    desc: ""
},
async ({
    m, client, args
}) => {
    if (!m.quoted) return m.reply("Please reply to an image, video, or audio message.");
    await m.react('⏫');
    try {
        let media, filename, filePath;
        if (m.quoted.message.imageMessage || m.quoted.message.videoMessage || m.quoted.message.audioMessage) {
            media = await m.quoted.download();
            if (m.quoted.message.audioMessage) {
                filename = `${makeid()}.mp3`;
                filePath = path.join(os.tmpdir(), filename);
                fs.writeFileSync(filePath, media);
            } else if (m.quoted.message.videoMessage) {
                filename = `${makeid()}.mp4`;
                filePath = path.join(os.tmpdir(), filename);
                fs.writeFileSync(filePath, media);
            } else if (m.quoted.message.imageMessage) {
                filename = `${makeid()}.jpg`;
                filePath = path.join(os.tmpdir(), filename);
                fs.writeFileSync(filePath, media);
            }
            const content = fs.readFileSync(filePath, { encoding: 'base64' });
            const githubApiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filename}`;
            const res = await axios.put(githubApiUrl, {
                message: `upload ${filename} by sparky`,
                content: content,
                branch: GITHUB_BRANCH
            }, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'upload-script'
                }
            });

            const fileUrl = `${VERCEL_DOMAIN}/${filename}`;
            await m.react('✅');
            await m.reply(`${fileUrl}`);
            fs.unlinkSync(filePath); // cleanup
        } else {
            return m.reply("Please reply to a valid media file (image, video, or audio).");
        }
    } catch (error) {
        await m.react('❌');
        console.error('Error:', error.response?.data || error.message);
        await m.reply(`Error: ${error.response?.data?.message || error.message}`);
    }
});