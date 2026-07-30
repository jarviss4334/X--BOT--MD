const {
	Sparky,
	isPublic
} = require("../lib");

Sparky({
    name: "online",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's online privacy settings. Use *all* to allow all users or *match_last_seen* to only allow those who match your last seen."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* online all_\n_to change *online* privacy settings_`);
    const available_privacy = ['all', 'match_last_seen'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateOnlinePrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "lastseen",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's last seen privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* lastseen all_\n_to change last seen privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateLastSeenPrivacy(args)
    await m.reply(`_Privacy settings *last seen* Updated to *${args}*_`);
});

Sparky({
    name: "profile",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's profile picture privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* profile all_\n_to change *profile picture* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateProfilePicturePrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "status",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's status privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* status all_\n_to change *status* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateStatusPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "readreceipt",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's read receipt privacy settings. Options are *all* or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* readreceipt all_\n_to change *read and receipts message* privacy settings_`);
    const available_privacy = ['all', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateReadReceiptsPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "groupadd",
    fromMe: true,
    category: "whatsapp",
    desc: "Changes the user's group addition privacy settings. Options include *all*, *contacts*, *contact_blacklist*, or *none*."
}, async ({ m, args, client }) => {
    if (!args) return await m.reply(`_*Example:-* groupadd all_\n_to change *group add* privacy settings_`);
    const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
    if (!available_privacy.includes(args)) return await m.reply(`_action must be *${available_privacy.join('/')}* values_`);
    await client.updateGroupsAddPrivacy(args)
    await m.reply(`_Privacy Updated to *${args}*_`);
});

Sparky({
    name: "fetch",
    fromMe: true,
    category: "whatsapp",
    desc: "Fetches and displays the privacy settings of the user, including online status, profile, last seen, read receipts, and more."
}, async ({ m, args, client }) => {
    const { readreceipts, profile, status, online, last, groupadd, calladd } = await client.fetchPrivacySettings(true);
    const msg = `Fetched Information:
---------------------
Name                 : ${client.user.name}
Online Status        : ${online}
Profile              : ${profile}
Last Seen            : ${last}
Read Receipts        : ${readreceipts}
Status Privacy       : ${status}
Group Addition       : ${groupadd}
Call Addition        : ${calladd}
`
    let img;
    try {
        img = {
            url: await client.profilePictureUrl(m.jid, 'image')
        };
    } catch (e) {
        img = {
            url: "https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg"
        };
    }
    await client.sendMessage(m.jid, {
        image: img,
        caption: msg
    })
});

Sparky({
    name: "🌛",
    fromMe: true,
    desc: "Deletes the replied message from the chat.",
    category: "whatsapp",
}, async ({ client, m }) => {
    try {
        if(!m.quoted) return m.reply("Reply to a message to delete it.");
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: false,
                id: m.quoted.key.id,
                participant: m.quoted.key.participant || m.quoted.key.remoteJid
            }
        });
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: true,
                id: m.quoted.key.id
            }
        });
        await client.sendMessage(m.jid, {
            delete: {
                remoteJid: m.jid,
                fromMe: true,
                id: m.key.id
            }
        });
    } catch (e) {}

});
