const {
    Sparky,
    commands,
    isPublic
} = require("../lib");
const {
    getBuffer
} = require("./pluginsCore");
const plugins = require("../lib");
const config = require("../config.js");
const font = require("@viper-x/fancytext");
const menust = config.MENU_FONT;
const style = font[menust];
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const _0x3471ce=_0x4c73;function _0x5149(){const _0x99704b=['HEROKU','PITCHER_API_BASE_URL','PWD','codesandbox','1460490jcYrnC','DIGITALOCEAN','REPLIT','13089848qhFTfM','CLOUDFLARE','GITHUB','TERMUX_VERSION','REPLIT_USER','env','32199750KLjfkJ','18wOomgQ','5701444PXyScu','AZURE','7366gnnTKS','846315zOxTke','RAILWAY','NETLIFY','VPS','AWS','GITHUB_SERVER_URL','DYNO','1131GsaKWJ','SPACE_ID','HUGGINGFACE','KOYEB','CODESANDBOX','RENDER','FLY_IO','5671732abHOue','AZURE_HTTP_FUNCTIONS','DIGITALOCEAN_APP_NAME','CF_PAGES','VERCEL','LINUX','userland'];_0x5149=function(){return _0x99704b;};return _0x5149();}(function(_0x14bc52,_0x9e047e){const _0x5ac994=_0x4c73,_0x256c17=_0x14bc52();while(!![]){try{const _0x1155d4=parseInt(_0x5ac994(0x14a))/0x1+parseInt(_0x5ac994(0x130))/0x2*(-parseInt(_0x5ac994(0x138))/0x3)+parseInt(_0x5ac994(0x13f))/0x4+parseInt(_0x5ac994(0x131))/0x5*(parseInt(_0x5ac994(0x12d))/0x6)+parseInt(_0x5ac994(0x12e))/0x7+parseInt(_0x5ac994(0x126))/0x8+-parseInt(_0x5ac994(0x12c))/0x9;if(_0x1155d4===_0x9e047e)break;else _0x256c17['push'](_0x256c17['shift']());}catch(_0x5dbaeb){_0x256c17['push'](_0x256c17['shift']());}}}(_0x5149,0xd4926));function _0x4c73(_0x3c6eb7,_0x511653){const _0x514924=_0x5149();return _0x4c73=function(_0x4c737c,_0x3e9250){_0x4c737c=_0x4c737c-0x125;let _0x40d9b6=_0x514924[_0x4c737c];return _0x40d9b6;},_0x4c73(_0x3c6eb7,_0x511653);}let SERVER=process[_0x3471ce(0x12b)][_0x3471ce(0x148)]?.['includes'](_0x3471ce(0x145))?_0x3471ce(0x144):process[_0x3471ce(0x12b)][_0x3471ce(0x147)]?.['includes'](_0x3471ce(0x149))?_0x3471ce(0x13c):process['env'][_0x3471ce(0x12a)]?_0x3471ce(0x125):process[_0x3471ce(0x12b)]['AWS_REGION']?_0x3471ce(0x135):process['env'][_0x3471ce(0x129)]?'TERMUX':process['env'][_0x3471ce(0x137)]?_0x3471ce(0x146):process[_0x3471ce(0x12b)]['KOYEB_APP_ID']?_0x3471ce(0x13b):process[_0x3471ce(0x12b)][_0x3471ce(0x136)]?_0x3471ce(0x128):process['env']['RENDER']?_0x3471ce(0x13d):process[_0x3471ce(0x12b)]['RAILWAY_SERVICE_NAME']?_0x3471ce(0x132):process[_0x3471ce(0x12b)][_0x3471ce(0x143)]?_0x3471ce(0x143):process[_0x3471ce(0x12b)][_0x3471ce(0x141)]?_0x3471ce(0x14b):process['env'][_0x3471ce(0x140)]?_0x3471ce(0x12f):process[_0x3471ce(0x12b)][_0x3471ce(0x133)]?_0x3471ce(0x133):process[_0x3471ce(0x12b)]['FLY_IO']?_0x3471ce(0x13e):process['env'][_0x3471ce(0x142)]?_0x3471ce(0x127):process[_0x3471ce(0x12b)][_0x3471ce(0x139)]?_0x3471ce(0x13a):_0x3471ce(0x134);
const util = require("util");
const {
    updatefullpp,
    getJson
} = require("./pluginsCore");
Sparky({
    name: "menu",
    category: "misc",
    fromMe: isPublic,
    desc: "List all available commands"
}, async ({
    client,
    m,
    args
}) => {
    try {
        if (args) {
            for (let i of plugins.commands) {
                if (i.name.test(args)) {
                    return m.reply(style(`*command : ${args.trim()}*\n*description : ${i.desc.toLowerCase()}*`));
                }
            }
            return m.reply(style("_oops command not found_"))
        } else {
            let [date,
                time
            ] = new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata"
            }).split(",");
            let menu = `╭━━━〔${config.BOT_INFO.split(";")[0].toLowerCase()}〕━━>
┃╭━━━━━━━━━━━━━◉
┃┃•  owner : ${config.BOT_INFO.split(";")[1].toLowerCase()}
┃┃•  mode : ${config.WORK_TYPE.toLowerCase()}
┃┃•  prefix : ${m.prefix}
┃┃•  platform : ${SERVER}
┃┃•  date : ${date}
┃┃•  time : ${time}
┃┃•  uptime : ${await m.uptime()}
┃┃•  plugins : ${commands.length}
┃╰━━━━━━━━━━━━━◉
╰━━━━━━━━━━━━━>\n ${readMore}\n\n`;

            let cmnd = [];
            let Sparky;
            let type = [];

            // Sorting commands based on category
            commands.map((command, num) => {
                if (command.name) {
                    let SparkyName = command.name;
                    Sparky = SparkyName.source.split('\\s*')[1].toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
                }
                if (command.dontAddCommandList || Sparky === undefined) return;
                if (!command.dontAddCommandList && Sparky !== undefined) {
                    let category;
                    if (!command.category) {
                        category = "misc";
                    } else {
                        category = command.category.toLowerCase();
                    }
                    cmnd.push({
                        Sparky,
                        category: category
                    });
                    if (!type.includes(category)) type.push(category);
                }
            });

            cmnd.sort();
            type.sort().forEach((cmmd) => {
                menu += `╭━━━>
┠┌─⭓『 *${cmmd.toUpperCase()}* 』\n`;
                let comad = cmnd.filter(({ category }) => category == cmmd);
                comad.sort();
                comad.forEach(({ Sparky }) => {
                    menu += `┃│• ${Sparky.trim()}\n`;
                });
                menu += `┃└─⭓\n`;
                menu += `╰━━━━>\n`;
            });
            let sperky = {
                "key": {
                    "participants": "0@s.whatsapp.net",
                    "remoteJid": "status@broadcast",
                    "fromMe": false,
                    "id": "Hey!"
                },
                "message": {
                    "contactMessage": {
                        "displayName": `${config.BOT_INFO.split(";")[0]}`,
                        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                    }
                },
                "participant": "0@s.whatsapp.net"
            }
            switch (config.MENU_TYPE.toLowerCase()) {
                case 'big': {
                    return await client.sendMessage(m.jid, {
                        text: style(menu),
                        contextInfo: {
                            externalAdReply: {
                                title: style(`Hey ${m.pushName}!`),
                                body: style(`${config.BOT_INFO.split(";")[0]}`),
                                sourceUrl: "https://sparky.biz.id",
                                mediaType: 1,
                                showAdAttribution: true,
                                renderLargerThumbnail: true,
                                thumbnailUrl: `${config.BOT_INFO.split(";")[2]}`
                            }
                        }
                    }, { quoted: m });
                    break;
                }
                case 'image': {
                    return await m.sendFromUrl(config.BOT_INFO.split(";")[2], { caption: style(menu) }); //client.sendMessage(m.jid, { image: config.BOT_INFO.split(";")[2], caption: style(menu) }, { quoted: m });
                    break;
                }
                case 'small': {
                    return await client.sendMessage(m.jid, {
                        text: style(menu),
                        contextInfo: {
                            externalAdReply: {
                                title: style(`Hey ${m.pushName}!`),
                                body: style(`${config.BOT_INFO.split(";")[0]}`),
                                sourceUrl: "https://sparky.biz.id",
                                mediaUrl: "https://sparky.biz.id",
                                mediaType: 1,
                                showAdAttribution: true,
                                renderLargerThumbnail: false,
                                thumbnailUrl: `${config.BOT_INFO.split(";")[2]}`
                            }
                        }
                    }, { quoted: sperky });
                    break;
                }
                case 'document': {
                    return await client.sendMessage(m.jid, {
                        document: {
                            url: 'https://i.ibb.co/pnPNhMZ/2843ad26fd25.jpg'
                        },
                        caption: menu,
                        mimetype: 'application/zip',
                        fileName: style(config.BOT_INFO.split(";")[0]),
                        fileLength: "99999999999",
                        contextInfo: {
                            externalAdReply: {
                                title: style(`Hey ${m.pushName}!`),
                                body: style(`${config.BOT_INFO.split(";")[0]}`),
                                sourceUrl: "https://sparky.biz.id",
                                mediaType: 1,
                                showAdAttribution: true,
                                renderLargerThumbnail: true,
                                thumbnailUrl: `${config.BOT_INFO.split(";")[2]}`
                            }
                        }
                    }, {
                        quoted: sperky
                    });
                    break;
                }
                case 'text': {
                    return await client.sendMessage(m.jid, {
                        text: style(menu)
                    }, {
                        quoted: sperky
                    });
                    break;
                }
                case 'video': {
                    return await client.sendMessage(
                        m.jid,
                        {
                            video: { url: config.BOT_INFO.split(";")[2] },
                            caption: style(menu),
                            gifPlayback: true
                        },
                        { quoted: sperky }
                    );
                    break;
                }
                case 'payment': {
                    return await client.relayMessage(m.jid, {
                        requestPaymentMessage: {
                            currencyCodeIso4217: 'INR',
                            amount1000: '99000',
                            requestFrom: m.sender.jid,
                            noteMessage: {
                                extendedTextMessage: {
                                    text: style(menu)
                                }
                            },
                            expiryTimestamp: '0',
                            amount: {
                                value: '99000',
                                offset: 1000,
                                currencyCode: 'INR'
                            },
                        }
                    }, {});
                    break;
                }
                default: {
                    console.log("Unsupported menu format!", config.MENU_TYPE);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});

Sparky(
    {
        on: "text",
        fromMe: true,
    },
    async ({ client, m, args }) => {
        try {
            args = args || "";
            if (typeof args !== "string") args = String(args);
            if (args.startsWith("$")) {
                try {
                    const code = args.slice(1).trim();
                    let evaled = await eval(`(async () => { ${code} })()`);
                    if (typeof evaled !== "string") evaled = util.inspect(evaled);
                    await m.reply(`\`\`\`${evaled}\`\`\``);
                } catch (err) {
                    await m.reply(`_${util.format(err)}_`);
                }
            }
        } catch (e) {
            console.error("Eval plugin error:", e);
        }
    }
);
