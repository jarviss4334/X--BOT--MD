const { delay } = require('baileys');
const { Sparky, isPublic } = require('../lib');
const {
    getAntiLink,
    setAntiLink,
    setAllowedUrl,
    normalizeUrl
} = require('../lib/antilink');

const { getString } = require('./pluginsCore');
const lang = getString('group');

Sparky({
    on: "message",
}, async ({ m, client }) => {

    if (!m.isGroup) return;
    let user = m.participant || m.sender || m.key?.participant;
    if (!user) return;
    if (user.endsWith("@lid")) return;
    if (user.includes(":")) {
        user = user.split(":")[0] + "@s.whatsapp.net";
    }

    if (!user.endsWith("@s.whatsapp.net")) return;

    try {
        addMsg(m.jid, user);
    } catch (e) {
        console.log("TRACK ERROR:", e);
    }

    try {
        const antilink = await getAntiLink(m.jid);
        if (!antilink?.enabled) return;
        if (await m.isAdmin(user)) return;
        if (user === client.user.id) return;
        const text =
    	 m.text ||
		 m.message?.conversation ||
   		 m.message?.extendedTextMessage?.text ||
    "";

if (!text) return;
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|chat\.whatsapp\.com\/[^\s]+)/gi;
        const foundLinks = text.match(urlRegex);

        if (!foundLinks) return;

        const allowedList = antilink.allowedUrls && antilink.allowedUrls !== "null"
            ? antilink.allowedUrls.split(",")
            : [];

        const normalizedAllowed = allowedList.map(u => u.replace(/^!/, ''));

        const blocked = foundLinks.some(link => {
            const clean = normalizeUrl(link);
            return !normalizedAllowed.includes(clean);
        });

        if (!blocked) return;
        if (antilink.action === "kick") {
            await client.groupParticipantsUpdate(m.jid, [user], "remove");
            return m.reply(`🚫 @${user.split("@")[0]} removed for sending link`, {
                mentions: [user]
            });
        }

        if (antilink.action === "warn") {
            return m.reply(`⚠️ @${user.split("@")[0]} links are not allowed`, {
                mentions: [user]
            });
        }
        if (antilink.action === "delete") {
    try {
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || m.key.remoteJid
            }
        });
    } catch (e) {
        console.log("DELETE ERROR:", e);
    }
}

    } catch (err) {
        console.log("ANTILINK ERROR:", err);
    }
});


Sparky({
	name: 'return',
	fromMe: true,
	desc: lang.TAG_DESC,
	category: 'group',
}, async ({
	m,
	client,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if (!args) return await m.reply(lang.TAG_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	const groupMetadata = await client.groupMetadata(m.jid);
	const jids = groupMetadata.participants.map(p => p.id);
	const content = typeof args === 'string' ? {
		text: args ? args : m.quoted.text,
		mentions: jids
	} : args;
	const options = {
		contextInfo: {
			mentionedJid: jids
		}
	};
	return typeof args === 'string' ? await client.sendMessage(m.jid, content, {
		quoted: m
	}) : await m.forwardMessage(m.jid, content, options);
});


Sparky({
	name: "👻",
	fromMe: true,
	desc: lang.TAGALL_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
		const {
			participants
		} = await client.groupMetadata(m.jid).catch(() => ({
			participants: []
		}));
		if (!participants.length) return await m.reply(lang.ERROR_METADATA);
		const msg = participants.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`).join("\n");
		const jids = participants.map(p => p.id);
		return await m.sendMsg(m.jid, msg, {
			mentions: jids,
			quoted: m
		});
});


// Sparky({
// 	name: "add",
// 	fromMe: true,
// 	desc: lang.ADD_DESC,
// 	category: "group",
// }, async ({
// 	client,
// 	m,
// 	args
// }) => {
// 	args = args || m.quoted;
// 	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
// 	if (!args) return await m.reply(lang.ADD_ALERT);
// 	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
// 	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
// 	await client.groupParticipantsUpdate(m.jid, [jid], 'add');
// 	return await m.sendMsg(m.jid, lang.ADDED.replace("{}", `@${jid.split("@")[0]}`), {
// 		mentions: [jid],
// 		quoted: m
// 	});
// });


Sparky({
	name: "kick",
	fromMe: true,
	desc: lang.KICK_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if (!args) return await m.reply(lang.KICK_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	await client.groupParticipantsUpdate(m.jid, [jid], 'remove');
	return await m.sendMsg(m.jid, lang.KICKED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "promote",
	fromMe: true,
	desc: lang.PROMOTE_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if (!args) return await m.reply(lang.PROMOTE_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	if(await m.isAdmin(jid)) return await m.reply(lang.ALREADY_PROMOTED);
	await client.groupParticipantsUpdate(m.jid, [jid], 'promote');
	return await m.sendMsg(m.jid, lang.PROMOTED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "demote",
	fromMe: true,
	desc: lang.DEMOTE_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	args = args || m.quoted;
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if (!args) return await m.reply(lang.DEMOTE_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	let jid = m.quoted ? m.quoted.sender : await m.formatNumberToJid(args);
	if(!await m.isAdmin(jid)) return await m.reply(lang.ALREADY_DEMOTED);
	await client.groupParticipantsUpdate(m.jid, [jid], 'demote');
	return await m.sendMsg(m.jid, lang.DEMOTED.replace("{}", `@${jid.split("@")[0]}`), {
		mentions: [jid],
		quoted: m
	});
});


Sparky({
	name: "mute",
	fromMe: true,
	desc: lang.MUTE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'announcement');
	return await m.sendMsg(m.jid, lang.MUTED);
});


Sparky({
	name: "unmute",
	fromMe: true,
	desc: lang.UNMUTE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'not_announcement');
	return await m.sendMsg(m.jid, lang.UNMUTED);
});


Sparky({
	name: "glock",
	fromMe: true,
	desc: lang.GLOCK_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'locked');
	return await m.sendMsg(m.jid, lang.GLOCKED);
});


Sparky({
	name: "gunlock",
	fromMe: true,
	desc: lang.GUNLOCK_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupSettingUpdate(m.jid, 'unlocked');
	return await m.sendMsg(m.jid, lang.GUNLOCKED);
});


Sparky({
	name: "invite",
	fromMe: true,
	desc: lang.INVITE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	return await m.reply(lang.INVITE.replace("{}", `https://chat.whatsapp.com/${await client.groupInviteCode(m.jid)}`));
});


Sparky({
	name: "revoke",
	fromMe: true,
	desc: lang.REVOKE_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupRevokeInvite(m.jid)
	return await m.reply(lang.REVOKED);
});


Sparky({
	name: "gname",
	fromMe: true,
	desc: lang.GNAME_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if(!args) return await m.reply(lang.GNAME_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupUpdateSubject(m.jid, args)
	return await m.sendMsg(m.jid, lang.GNAME_SUCCESS.replace("{}", args));
});


Sparky({
	name: "gdesc",
	fromMe: true,
	desc: lang.GDESC_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	if(!args) return await m.reply(lang.GDESC_ALERT);
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.groupUpdateDescription(m.jid, args)
	return await m.sendMsg(m.jid, lang.GDESC_SUCCESS.replace("{}", args));
});


Sparky({
	name: "joinrequests",
	fromMe: true,
	desc: lang.JOINREQUESTS_DESC,
	category: "group",
}, async ({
	client,
	m,
	args
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	const allJoinRequests = await client.groupRequestParticipantsList(m.jid);
	if(allJoinRequests.length === 0) {
	return await m.reply(lang.JOINREQUESTS_NULL);
	}
	if(args) {
	switch(args.toLowerCase()) {
	case 'approve all': {
	await m.sendMsg(m.jid, lang.JOINREQUESTS_APPROVING.replace("{}", allJoinRequests.length));
	for(let i of allJoinRequests) {
	await client.groupRequestParticipantsUpdate(m.jid, [i.jid], "approve");
	await delay(900);
	}
	break;
	}
	case 'reject all': {
	await m.sendMsg(m.jid, lang.JOINREQUESTS_REJECTING.replace("{}", allJoinRequests.length));
	for(let i of allJoinRequests) {
	await client.groupRequestParticipantsUpdate(m.jid, [i.jid], "reject");
	await delay(900);
	}
	break;
	}
	default: {
	return await m.reply(lang.JOINREQUESTS_INVAILD_PARAMS);
	}
	}
	return;
	}
	const formattedList = allJoinRequests
    .map((item, index) => {
	    const requestVia = item.request_method === "linked_group_join" ? "community_" : item.request_method === "invite_link" ? "invite link_" : `added by @${item.requestor?.split("@")[0]}_`;
	    return `_${index + 1}. @${item.jid.split("@")[0]}_\n_• Request via: ${requestVia}\n_• Requested time: ${new Date(parseInt(item.request_time) * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}_`})
    .join('\n\n');
	const jids = allJoinRequests.map(i => i.jid);
	return await m.sendMsg(m.jid,lang.JOINREQUESTS_FOUND.replace("{}", formattedList), { mentions: jids });
});


Sparky({
	name: "leave",
	fromMe: isPublic,
	desc: lang.LEAVE_DESC,
	category: "group",
}, async ({ client, m }) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	const msg = lang.LEAVE_MSG || " Leaving group...";
	await m.sendMsg(m.jid, msg);
	await delay(1000);

	return await client.groupLeave(m.jid);
});

Sparky({
	name: "removegpp",
	fromMe: true,
	desc: lang.REMOVEGPP_DESC,
	category: "group",
}, async ({
	client,
	m
}) => {
	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);
	
	//if (!m.botIsAdmin) return await m.reply(lang.NOT_ADMIN);
	await client.removeProfilePicture(m.jid);
	return await m.sendMsg(m.jid, lang.REMOVEGPP_SUCCESS);
});


const sharp = require("sharp");

Sparky({
	name: "gpp",
	fromMe: true,
	desc: lang.GPP_DESC,
	category: "group",
}, async ({ client, m }) => {

	if (!m.isGroup) return await m.reply(lang.NOT_GROUP);

	if (!m.quoted) return await m.reply("❌ Reply to an image");

	if (!m.quoted.message?.imageMessage)
		return await m.reply("❌ Reply to a valid image");

	try {
		await m.react("☠️");
		let buffer = await m.quoted.download();
		const img = await sharp(buffer)
			.resize(640, 640, { fit: "cover" }) 
			.jpeg({ quality: 80 })
			.toBuffer();
		await client.updateProfilePicture(m.jid, img);
		await m.react("🎈");
		return await m.reply("🍻 Group profile updated");

	} catch (err) {
		console.log("GPP ERROR:", err);
		await m.react("❌");
		return await m.reply("❌ Failed to update group profile");
	}
});

Sparky({
    name: 'ginfo',
    fromMe: true, 
    desc: 'Get detailed group information including members, admins, and owner',
    category: 'group',
}, async ({ client, m }) => {
    if (!m.isGroup) return await m.reply(lang.NOT_GROUP || 'This command can only be used in groups!');

    try {
        const groupMetadata = await client.groupMetadata(m.jid);
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins
            .map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`)
            .join('\n');
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.jid.split('-')[0] + '@s.whatsapp.net';
        let pp;
        try {
            pp = await client.profilePictureUrl(m.jid, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; 
        }
const text = `
╭━━━〔 group info 〕━━>
┃╭──────────────◉
┃┃ id : ${groupMetadata.id}
┃┃ name : ${groupMetadata.subject}
┃┃ members : ${participants.length}
┃┃ owner : @${owner.split('@')[0]}
┃╰──────────────◉
┃
┃╭──────── admins ────────◉
${listAdmin 
    ? listAdmin.split('\n').map(a => `┃┃ ${a}`).join('\n')
    : '┃┃ none'}
┃╰──────────────◉
┃
┃╭────── description ─────◉
┃┃ ${groupMetadata.desc?.toString() || 'no description'}
┃╰──────────────◉
╰━━━━━━━━━━━━━━━>
`.trim();
        await client.sendMessage(m.jid, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in groupinfo command:', error);
        await m.reply(lang.ERROR_METADATA || 'Failed to get group info!');
    }
});

const fs = require("fs");
const path = require("path");
const MSG_FILE = path.join(__dirname, "msgDB.json");

function loadDB() {
    if (!fs.existsSync(MSG_FILE)) return {};
    return JSON.parse(fs.readFileSync(MSG_FILE));
}

function saveDB(data) {
    fs.writeFileSync(MSG_FILE, JSON.stringify(data, null, 2));
}

function addMsg(jid, user) {
    const db = loadDB();

    if (!db[jid]) db[jid] = {};
    if (!db[jid][user]) {
        db[jid][user] = { total: 0, time: 0 };
    }

    db[jid][user].total += 1;
    db[jid][user].time = Date.now();

    saveDB(db);
}

Sparky({
    name: "msgs",
    fromMe: true,
    desc: "Show user message stats",
    category: "group",
}, async ({ m }) => {

    if (!m.isGroup) return m.reply("❌ Group only");

    const db = loadDB();
    const groupData = db[m.jid] || {};

    if (!Object.keys(groupData).length) {
        return m.reply("⚠️ No data yet");
    }

let msg = `
╭━━━〔 message stats 〕━━>
┃╭──────────────◉
`.trim() + "\n";

const now = Date.now();
let i = 1;

for (const user in groupData) {
    const data = groupData[user];

    const last = data.time
        ? Math.floor((now - data.time) / 1000) + "s ago"
        : "never";

    const number = user.split("@")[0].replace(/[^0-9]/g, '');

    msg += `┃┃ ${i++}. @${number}\n`;
    msg += `┃┃ ├ msgs : ${data.total}\n`;
    msg += `┃┃ └ last : ${last}\n`;
    msg += `┃\n`;


msg += `┃╰──────────────◉
╰━━━━━━━━━━━━━━━>`;
}

    return m.sendMsg(m.jid, msg, {
        mentions: Object.keys(groupData)
    });
});

