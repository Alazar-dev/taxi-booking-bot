const Markup = require("telegraf/markup");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const https = require("https");
const request = require("request");
const { markup } = require("telegraf/extra");

const bot = new Telegraf("1466788797:AAEVNxieNR7ILDo_QQt5IxZPsDQ1CzX86e0");

// Global commands
bot.start((ctx) => {
	return ctx.reply(
		"Let us proceed",
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
		"Hey ✋️, I'm Ride Booking bot.\n\nYou can start by sending this command:\n\n/start - restarts the bot",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["Start"]])
				.oneTime();
		})
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
	const api_url = "localhost:5000//ride-booking-api/api/users";
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
				"Good Now share me your location, it helps you meet least distant car",
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([
							[markup.locationRequestButton("Share Your Location")]
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
	const api_url = "https://instant-prayer-api.herokuapp.com/api/users";
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
				"Good",
				
				
			);
		}
	});
});

// message reply section
bot.hears("👥 About Me", (ctx) => {
	ctx.reply(
		"Hey There 👋, This bot helps you to find the least distant ride. And thank you for using our simplest ride booking platform to use",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["Start"]])
				.oneTime();
		})
	);
});

bot.hears("Start", (ctx) => {
	return ctx.reply(
		"Let us proceed",
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
		"Hey ✋️, I'm Ride Booking bot.\n\nYou can start by sending this command:\n\n/start - restarts the bot",
		Extra.markup((markup) => {
			return markup
				.resize()
				.keyboard([["Start"]])
				.oneTime();
		})
	);
});

// bot actions
bot.action(/.+/, (ctx) => {
	let prefferedDate = {
		prayerDate: ctx.match[0],
	};
	const api_url = "https://instant-prayer-api.herokuapp.com/api/users";
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

// bot.action("delete", ({deleteMessage}) => deleteMessage())
bot.launch();
