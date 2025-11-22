const fs = require("fs");
const dotenv = require("dotenv");
const {
	Sequelize
} = require("sequelize");

function toBool(value) {
	return value === "true";
}

if (fs.existsSync("config.env")) {
	dotenv.config({
		path: "./config.env"
	});
}

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://aswin:D6dq0vk1xoQx_OO-Iv4ESQ@rough-doxle-2360.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"; // Corrected SQLite format

if (!DATABASE_URL.startsWith("sqlite://") && !DATABASE_URL.startsWith("postgres://") && !DATABASE_URL.startsWith("postgresql://")) {
	throw new Error("Invalid DATABASE_URL format. Use 'sqlite://' or 'postgres://'");
}

const DATABASE = DATABASE_URL.startsWith("sqlite://") ? new Sequelize(DATABASE_URL, {
	dialect: "sqlite",
	storage: DATABASE_URL.replace("sqlite://", ""),
	logging: false
}) : new Sequelize(DATABASE_URL, {
	dialect: "postgres",
	protocol: "postgres",
	ssl: true,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		},
	},
	logging: false,
});

DATABASE.authenticate().then(() => console.log("Database connection established successfully.")).catch((err) => console.error("Database connection failed:", err.message));

module.exports = {
	VERSION: require("./package.json").version,
	ALIVE: process.env.ALIVE || "Hello i'm alive",
	ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE || "false"),
	BGMBOT : toBool(process.env.BGMBOT || "false"),
	API: "https://api-aswin-sparky.koyeb.app",
	AUDIO_DATA: process.env.AUDIO_DATA || "X BOT MD;ASWIN SPARKY;https://url.sparky.biz.id/5ftLiA.jpg",
	AUTO_STATUS_VIEW: toBool(process.env.AUTO_STATUS_VIEW || "false"),
	BOT_INFO: process.env.BOT_INFO || "🇹🇭⃝࿅ᴛͥʜͭ͢ᴇᴊᷟᴜꜱᷤᴢ͢ ⧽↝💎;🇹🇭⃝࿅ᴛͥʜͭ͢ᴇᴊᷟᴜꜱᷤᴢ͢ ⧽↝💎;https://files.catbox.moe/x3t6vu.jpg",
	CALL_BLOCK: toBool(process.env.CALL_BLOCK || "false"),
	CALL_BLOCK_MSG: process.env.CALL_BLOCK_MSG || "_Calls are not allowed rn. Please don’t call again!._",
	DATABASE_URL,
	DATABASE,
	DISABLE_PM: toBool(process.env.DISABLE_PM || "false"),
	HANDLERS: (process.env.HANDLERS || process.env.HANDLER || process.env.PREFIX || ".").trim(),
	HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
	HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
	KOYEB_API_KEY: process.env.KOYEB_API_KEY || process.env.KOYEB_KEY || "",
	KOYEB_SERVICE_NAME: process.env.KOYEB_SERVICE_NAME || process.env.KOYEB_APP_NAME || process.env.KOYEB_NAME || "",
	RENDER_API_KEY: process.env.RENDER_API_KEY || process.env.RENDER_KEY || "",
	RENDER_APP_NAME: process.env.RENDER_APP_NAME || process.env.RENDER_NAME || "",
	LANGUAGE: process.env.LANGUAGE || "english",
	LOGS: toBool(process.env.LOGS || "false"),
	MENU_TYPE: process.env.MENU_TYPE || "image", // Menu style: big, small, image, document, text, call, payment
	MENU_FONT: process.env.MENU_FONT || "tiny", // randomStyle, strikeThrough, wingdings, vaporwave, typewriter, analucia, tildeStrikeThrough, underline, doubleUnderline, slashThrough, sparrow, heartsBetween, arrowBelow, crossAboveBelow, creepify, bubbles, mirror, squares, roundsquares, flip, tiny, createMap, serif_I, manga, ladybug, runes, serif_B, serif_BI, serif_I, fancy1, fancy2, fancy3, fancy4, fancy5, fancy6, fancy7, fancy8, fancy9, fancy10, fancy11, fancy12, fancy13, fancy14, fancy15, fancy16, fancy17, fancy18, fancy19, fancy20, fancy21, fancy22, fancy23, fancy24, fancy25, fancy26, fancy27, fancy28, fancy29, fancy30, fancy31, fancy32, fancy33
	PORT: process.env.PORT || 8080,
	PING: process.env.PING || "🇹🇭⃝࿅ᴛͥʜͭ͢ᴇᴊᷟᴜꜱᷤᴢ͢ ⧽↝💎",
	PM_BLOCK: toBool(process.env.PM_BLOCK || "false"),
	READ_MESSAGES: toBool(process.env.READ_MESSAGES || "false"),
	REJECT_CALL: toBool(process.env.REJECT_CALL || "false"),
	REJECT_CALL_MSG: process.env.REJECT_CALL_MSG || "_Calls are not allowed. Please don’t call again!._",
	SESSION_ID: process.env.SESSION_ID || "",
	START_MSG: toBool(process.env.START_MSG || "true"),
	STICKER_DATA: process.env.STICKER_DATA || `🇹🇭⃝࿅ᴛͥʜͭ͢ᴇᴊᷟᴜꜱᷤᴢ͢ ⧽↝💎`,
	SUDO: process.env.SUDO || "918129927512",
	WORK_TYPE: process.env.WORK_TYPE || "public",
	SAVE_STATUS: toBool(process.env.SAVE_STATUS || "false"),
	STATUS_REPLY: toBool(process.env.STATUS_REPLY || "false"),
	STATUS_REPLY_MSG: process.env.STATUS_REPLY_MSG || "Nice Status Brother 🦫✨",
	STATUS_REACTION: toBool(process.env.STATUS_REACTION || "false"),
	STATUS_REACTION_EMOJI: process.env.STATUS_REACTION_EMOJI || "🍉,🍓,🎀,💀,💗,📍,🔪,🛒,☠️,🐍,👍🏻",
	WARN_COUNT: process.env.WARN_COUNT || "3"
};
