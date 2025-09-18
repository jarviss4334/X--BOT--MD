const {Sparky} = require('../lib');
const {getString} = require('./pluginsCore');
const appClient = require('./pluginsCore/app.js');
const app = new appClient();
const simpleGit = require('simple-git');
const git = simpleGit();
const {exec} = require("child_process");
const config = require("../config")
const lang = getString('app');


Sparky({
      name: "update",
      fromMe: true,
      desc: "Update",
      category: "app",
  },
  async ( { args, m }) => {
      await git.fetch();
      var commits = await git.log(['main' + "..origin/" + 'main']);
      let message = "*_New updates available!_*\n\n";
      commits["all"].map((e, i) =>
          message += "```" + `${i + 1}. ${e.message}\n[${e.date.substring(0, 10)}]\n` + "```"
      );

      if (args) {
            switch (args) {
                        case 'now': {
                              if(commits.total === 0) return await m.reply("```Bot is up-to-date!```");
                              await m.reply('_*Updating...*_');
          await app.update();
            const interval = setInterval(async () => {
                  const status = await app.deploymentInfo()
                  if(status === 'STARTING') {
                        await m.reply("_*Bot updated!*_\n_Restarting..._");
                        clearInterval(interval);
                  }
            }, 5000)
                              break;
                        }
            default: {
                  
            }
            }
            return;
      }
        return await m.reply(commits.total !== 0 ? message + `\n_Use '${m.prefix}update now' to update the bot._` : "```Bot is up-to-date!```");
  }
);


Sparky({
      name: "platform",
      fromMe: true,
      desc: lang.RESTART_DESC,
      category: "app",
  },
  async ( {
        m
  }) => {
      const _0x3471ce=_0x4c73;function _0x5149(){const _0x99704b=['HEROKU','PITCHER_API_BASE_URL','PWD','codesandbox','1460490jcYrnC','DIGITALOCEAN','REPLIT','13089848qhFTfM','CLOUDFLARE','GITHUB','TERMUX_VERSION','REPLIT_USER','env','32199750KLjfkJ','18wOomgQ','5701444PXyScu','AZURE','7366gnnTKS','846315zOxTke','RAILWAY','NETLIFY','VPS','AWS','GITHUB_SERVER_URL','DYNO','1131GsaKWJ','SPACE_ID','HUGGINGFACE','KOYEB','CODESANDBOX','RENDER','FLY_IO','5671732abHOue','AZURE_HTTP_FUNCTIONS','DIGITALOCEAN_APP_NAME','CF_PAGES','VERCEL','LINUX','userland'];_0x5149=function(){return _0x99704b;};return _0x5149();}(function(_0x14bc52,_0x9e047e){const _0x5ac994=_0x4c73,_0x256c17=_0x14bc52();while(!![]){try{const _0x1155d4=parseInt(_0x5ac994(0x14a))/0x1+parseInt(_0x5ac994(0x130))/0x2*(-parseInt(_0x5ac994(0x138))/0x3)+parseInt(_0x5ac994(0x13f))/0x4+parseInt(_0x5ac994(0x131))/0x5*(parseInt(_0x5ac994(0x12d))/0x6)+parseInt(_0x5ac994(0x12e))/0x7+parseInt(_0x5ac994(0x126))/0x8+-parseInt(_0x5ac994(0x12c))/0x9;if(_0x1155d4===_0x9e047e)break;else _0x256c17['push'](_0x256c17['shift']());}catch(_0x5dbaeb){_0x256c17['push'](_0x256c17['shift']());}}}(_0x5149,0xd4926));function _0x4c73(_0x3c6eb7,_0x511653){const _0x514924=_0x5149();return _0x4c73=function(_0x4c737c,_0x3e9250){_0x4c737c=_0x4c737c-0x125;let _0x40d9b6=_0x514924[_0x4c737c];return _0x40d9b6;},_0x4c73(_0x3c6eb7,_0x511653);}let SERVER=process[_0x3471ce(0x12b)][_0x3471ce(0x148)]?.['includes'](_0x3471ce(0x145))?_0x3471ce(0x144):process[_0x3471ce(0x12b)][_0x3471ce(0x147)]?.['includes'](_0x3471ce(0x149))?_0x3471ce(0x13c):process['env'][_0x3471ce(0x12a)]?_0x3471ce(0x125):process[_0x3471ce(0x12b)]['AWS_REGION']?_0x3471ce(0x135):process['env'][_0x3471ce(0x129)]?'TERMUX':process['env'][_0x3471ce(0x137)]?_0x3471ce(0x146):process[_0x3471ce(0x12b)]['KOYEB_APP_ID']?_0x3471ce(0x13b):process[_0x3471ce(0x12b)][_0x3471ce(0x136)]?_0x3471ce(0x128):process['env']['RENDER']?_0x3471ce(0x13d):process[_0x3471ce(0x12b)]['RAILWAY_SERVICE_NAME']?_0x3471ce(0x132):process[_0x3471ce(0x12b)][_0x3471ce(0x143)]?_0x3471ce(0x143):process[_0x3471ce(0x12b)][_0x3471ce(0x141)]?_0x3471ce(0x14b):process['env'][_0x3471ce(0x140)]?_0x3471ce(0x12f):process[_0x3471ce(0x12b)][_0x3471ce(0x133)]?_0x3471ce(0x133):process[_0x3471ce(0x12b)]['FLY_IO']?_0x3471ce(0x13e):process['env'][_0x3471ce(0x142)]?_0x3471ce(0x127):process[_0x3471ce(0x12b)][_0x3471ce(0x139)]?_0x3471ce(0x13a):_0x3471ce(0x134);
      return await m.reply(`*Platform Information*\n\n_*Server: ${SERVER}*_`);
 });

Sparky({
      name: "restart",
      fromMe: true,
      desc: lang.RESTART_DESC,
      category: "app",
  },
  async ( {
        m
  }) => {
      await m.reply(lang.RESTARTING);
      exec("pm2 restart X-BOT-MD", async (error, stdout, stderr) => {
      if (error) {
            return await m.reply(`Error: ${error}`);
      } 
      return;
    });
 });


Sparky({
		name: "setvar",
		fromMe: true,
		desc: lang.SETVAR_DESC,
		category: "app",
	},
	async ({
		m,
		args
	}) => {
		if (!args) return await m.reply(lang.SETVAR_ALERT.replace("{}", m.prefix));
		const [key, value] = args.split("=");
		const setVariable = await app.setVar(key.trim().toUpperCase(), value.trim());
		return await m.reply(setVariable ? lang.SETVAR_SUCCESS.replace("{}", key.trim().toUpperCase()).replace("{}", value.trim()) : lang.SETVAR_FAILED);
	});


Sparky({
		name: "delvar",
		fromMe: true,
		desc: lang.DELVAR_DESC,
		category: "app",
	},
	async ({
		m,
		args
	}) => {
		if (!args) return await m.reply(lang.DELVAR_ALERT.replace("{}", m.prefix));
		const delVariable = await app.deleteVar(args.trim().toUpperCase());
		return await m.reply(delVariable ? lang.DELVAR_SUCCESS.replace("{}", args.trim().toUpperCase()) : lang.DELVAR_NOTFOUND.replace("{}", args.trim().toUpperCase()));
	});


Sparky({
		name: "getvar",
		fromMe: true,
		desc: lang.GETVAR_DESC,
		category: "app",
	},
	async ({
		m,
		args
	}) => {
		if (!args) return await m.reply(lang.GETVAR_ALERT.replace("{}", m.prefix));
		const getVariables = await app.getVars();
		const vars = getVariables.find(i => i.key === args.toUpperCase());
		return await m.reply(`_${vars.key}: ${vars.value}_`);
	});
	
	
Sparky({
		name: "getallvars",
		fromMe: true,
		desc: lang.GETALLVARS_DESC,
		category: "app",
	},
	async ({
		m
	}) => {
		const getVariables = await app.getVars();
		const vars = getVariables.map((e, i)=> `\`\`\`${i + 1}. ${e.key}: ${e.value}\`\`\``).join('\n');
		return await m.reply(vars);
	});


Sparky({
	name: "mode",
	fromMe: true,
	desc: "hu",
	category: "app",
},
async ( {
	  m, args
}) => {
	if (args?.toLowerCase() == "public" || args?.toLowerCase() == "private"){
		await app.setVar("WORK_TYPE",args,m)
		return m.reply(`_Mode Sucessfuly Changed To: ${args}_`);
	} else {
		return await m.reply(`_*Mode manager*_\n_Current mode: ${config.WORK_TYPE}_\n_Use .mode public/private_`)
}
}
);


const settingsMenu = [
    { title: "Auto read all messages", env_var: "READ_MESSAGES" },
    { title: "Auto status react", env_var: "STATUS_REACTION" },
    { title: "Auto read status updates", env_var: "AUTO_STATUS_VIEW" },
    { title: "Auto reject calls", env_var: "REJECT_CALL" },
    { title: "Always online", env_var: "ALWAYS_ONLINE" },
    { title: "Disable bot in PM", env_var: "DISABLE_PM" },
    { title: "PM Auto blocker", env_var: "PM_BLOCK" },
    { title: "Bot Work type", env_var: "WORK_TYPE" }
];

let settingsContext = null;

Sparky({
    name: "settings",
    fromMe: true,
    desc: "Settings Configuration",
    category: "downloader",
}, async ({ m }) => {
    const menu = settingsMenu.map((e, i) => `_${i + 1}. ${e.title}_`).join("\n");
    const sent = await m.reply(`*_Settings Configuration Menu_*\n\n${menu}\n\n_Reply with a number to continue._`);
    settingsContext = { step: "menu", sender: m.sender, quotedId: sent.key.id };
});

Sparky({
    on: "text",
    fromMe: true,
}, async ({ client, m }) => {
    if (!settingsContext || settingsContext.sender !== m.sender) return;

    if (settingsContext.step === "menu" && m.quoted?.key?.id === settingsContext.quotedId) {
        const selected = settingsMenu[parseInt(m.text) - 1];
        if (!selected) return;

        const currentStatus = config[selected.env_var] ? "on" : "off";
        const statusOptions = ["on", "off"].map((s, i) => `_${i + 1}. ${s}_`).join("\n");

        const sent = await m.reply(
            `*_${selected.title}_*\n\n_Current status: ${currentStatus}_\n\n_Reply with a number to update the status._\n\n${statusOptions}`
        );

        settingsContext = { step: "status", sender: m.sender, quotedId: sent.key.id, title: selected.title, env_var: selected.env_var };
    }

    else if (settingsContext.step === "status" && m.quoted?.key?.id === settingsContext.quotedId) {
        const status = ["on", "off"][parseInt(m.text) - 1];
        if (!status) return;

        await app.setVar(settingsContext.env_var, status === "on" ? "true" : "false");

        await m.reply(`_${settingsContext.title} ${status === "on" ? "enabled." : "disabled."}_`);

        settingsContext = null;
    }
});

Sparky({
    name: "setsudo",
    fromMe: true,
    desc: lang.SETSUDO,
    category: "app",
},
async ({ m, args, client }) => {
    let newSudo =
        (m.quoted?.sender?.split("@")[0]) || 
        (m.mentions.length > 0 ? m.mentions[0].split("@")[0] : "") || 
        (args[0] ? args[0] : "");

    if (!newSudo) return await m.reply("*Need reply/mention/number*");

    newSudo = newSudo.replace(/[^0-9]/g, "");

    let oldSudo = config.SUDO?.split(",") || [];
    if (oldSudo.includes(newSudo)) {
        return await m.reply("_User is already a sudo_");
    }

    oldSudo.push(newSudo);
    let setSudo = oldSudo
        .map(x => (typeof x === "number" ? x.toString() : x.replace(/[^0-9]/g, "")))
        .join(",");

    await client.sendMessage(m.jid, {
        text: `_Added @${newSudo} as sudo_`,
        mentions: [`${newSudo}@s.whatsapp.net`],
    });

    await app.setVar("SUDO", setSudo, m);
});

Sparky({
    name: "delsudo",
    fromMe: true,
    desc: "Remove a sudo user",
    category: "app",
},
async ({ m, args, client }) => {
    let delSudo =
        (m.quoted?.sender?.split("@")[0]) ||
        ((m.mentions?.length ?? 0) > 0 ? m.mentions[0].split("@")[0] : "") ||
        (args[0] ? args[0] : "");

    if (!delSudo) return await m.reply("*Need reply/mention/number*");

    delSudo = delSudo.replace(/[^0-9]/g, "");

    let oldSudo = config.SUDO?.split(",") || [];
    if (!oldSudo.includes(delSudo)) {
        return await m.reply("_User is not a sudo_");
    }

    oldSudo = oldSudo.filter(num => num !== delSudo);
    let setSudo = oldSudo.join(",");

    await client.sendMessage(m.jid, {
        text: `_Removed @${delSudo} from sudo_`,
        mentions: [`${delSudo}@s.whatsapp.net`],
    });

    await app.setVar("SUDO", setSudo, m);
});

Sparky({
    name: "getsudo",
    fromMe: true,
    desc: "Show all current sudo users",
    category: "app",
},
async ({ m }) => {
    let sudoList = config.SUDO?.split(",").filter(x => x.trim() !== "") || [];

    if (sudoList.length === 0) {
        return await m.reply("_No sudo users found_");
    }

    let mentionList = sudoList.map(num => `${num}@s.whatsapp.net`);
    let textList = sudoList.map((num, i) => `${i + 1}. ${num}`).join("\n");

    await m.reply(`*Current SUDO Users:*\n\n${textList}`, {
        mentions: mentionList
    });
});
