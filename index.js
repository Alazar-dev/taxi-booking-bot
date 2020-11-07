const Markup = require("telegraf/markup");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const https = require("https");
const request = require("request");
const { markup } = require("telegraf/extra");

const bot = new Telegraf("1466788797:AAEVNxieNR7ILDo_QQt5IxZPsDQ1CzX86e0");

// Global commands
// Global commands
bot.start((ctx) => {
	return ctx.reply(
		"Almost there! Share your contact in order to proceed.",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([
					[markup.contactRequestButton("Share Your Contact"), , "💡 Help"],
					["👥 About Me"],
				])
				.oneTime();
		})
	);
});

bot.help((ctx) => {
	return ctx.reply(
		"Hey ✋️, I'm free taxi booking bot. In order to get this service, you need to share your contact with us. Then share your location and we will connect you with taxi near your location.",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["start"]])
				.oneTime();
		})
	);
});

bot.command("prayers", (ctx) => {
	return ctx.reply(
		"Choose your preffered prayer date",
		Extra.markup((m) =>
			m.inlineKeyboard([
				[m.callbackButton("Mon", "Monday"), m.callbackButton("Tue", "Tuesday")],
				[
					m.callbackButton("Wed", "Wednesday"),
					m.callbackButton("Thu", "Thursday"),
				],
				[
					m.callbackButton("Fri", "Friday"),
					m.callbackButton("Sat", "Saturday"),
				],
				[m.callbackButton("Sun", "Sunday")],
			])
		)
	);
});

bot.on("contact", (ctx) => {
	let userObject = {
		first_name: ctx.update.message.chat.first_name,
		last_name: ctx.update.message.chat.last_name,
		username: ctx.update.message.chat.username,
		Chat_Id: ctx.update.message.chat.id,
		phone_number: ctx.update.message.contact.phone_number,
	};
	const api_url = process.env.API_URL;
	var options = {
		uri: api_url,
		method: "POST",
		json: userObject,
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			return ctx.reply(
				"Good Now share me your location, it helps me send you more accurate prayers",
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([
							[markup.locationRequestButton("Share Your Location")],
							["💡 Help"],
						])
						.oneTime();
				})
			);
		}
	});
});

bot.on("location", (ctx) => {
	let locationObject = {
		latitude: ctx.update.message.location.latitude,
		longitude: ctx.update.message.location.longitude,
	};
	const api_url = process.env.API_URL;
	var options = {
		uri: api_url,
		method: "POST",
		json: locationObject,
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			return ctx.reply(
				"Thanks for sharing your location,\nyou can go to /prayers to choose your preffered prayer date",
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([["prayers"], ["💡 Help"]])
						.oneTime();
				})
			);
		}
	});
});

// message reply section
bot.hears("👥 About Me", (ctx) => {
	ctx.reply(
		"Hey There 👋, I am helping you to book the least distant taxi from where you are now.",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["start"]])
				.oneTime();
		})
	);
});

bot.hears("start", (ctx) => {
	return ctx.reply(
		"welcome to prayer mobilzation, In order to get started share me your contact and location or type /help if you need any help",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([
					[markup.contactRequestButton("Share Your Contact")],
					["👥 About Me"],
				])
				.oneTime();
		})
	);
});



bot.hears("💡 Help", (ctx) => {
	return ctx.reply(
		"Hey ✋️, I'm free taxi booking bot. In order to get this service, you need to share your contact with us. Then share your location and we will connect you with taxi near your location.",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["start"]])
				.oneTime();
		})
	);
});

// bot actions
bot.action(/.+/, (ctx) => {
	let prefferedDate = {
		prayerDate: ctx.match[0],
	};
	const api_url = process.env.API_URL;
	var options = {
		uri: api_url,
		method: "POST",
		json: prefferedDate,
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(response.body);
			return ctx.reply(`${ctx.match[0]} is your prayer date`);
		}
	});
});

bot.launch();