/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const Max = require('../events');
const UltraMax = require('UltraMax-public-1');
const { MessageType } = require('@adiwajshing/baileys');
const Config = require('../config');
const got = require('got');

const Language = require('../language');
const Lang = Language.getString('scrapers');
let LOL = Config.WORKTYPE == 'public' ? false : true

//Movie-scraper

Max.applyCMD({ pattern: 'movie ?(.*)', fromMe: LOL, desc: Lang.MOVIE_DESC ,  deleteCommand: false}, (async (message, match) => {
	const movie = match[1]
	if (movie === '') return await message.client.sendMessage(message.jid, Lang.MOVIE_NAME, MessageType.text, { quoted: message.data });
		let url = `http://www.omdbapi.com/?apikey=742b2d09&t=${match[1]}&plot=full`
		var payload = await UltraMax.movie(movie)
		const response = await got(url);
		const json = JSON.parse(response.body);
		if (json.Response != 'True') return await message.client.sendMessage(message.jid, '*Not found.*', MessageType.text, { quoted: message.data });
		let msg = '```';
		msg += 'π¬ Title      : ' + json.Title + '\n\n';
		msg += 'π Year       : ' + json.Year + '\n\n';
		msg += 'β­ Rated      : ' + json.Rated + '\n\n';
		msg += 'π Released   : ' + json.Released + '\n\n';
		msg += 'β³Runtime    : ' + json.Runtime + '\n\n';
		msg += 'π Genre      : ' + json.Genre + '\n\n';
		msg += 'π¨π»βπ» Director   : ' + json.Director + '\n\n';
		msg += 'βπ» Writer     : ' + json.Writer + '\n\n';
		msg += 'π¨π»βπ€ Actors     : ' + json.Actors + '\n\n';
		msg += 'πPlot       : ' + json.Plot + '\n\n';
		msg += 'π Language   : ' + json.Language + '\n\n';
		msg += 'π Country    : ' + json.Country + '\n\n';
		msg += 'ποΈ Awards     : ' + json.Awards + '\n\n';
		msg += 'π¦ BoxOffice  : ' + json.BoxOffice + '\n\n';
		msg += 'ποΈ Production : ' + json.Production + '\n\n';
		msg += 'π imdbRating : ' + json.imdbRating + '\n\n';
		msg += 'β imdbVotes  : ' + json.imdbVotes + '```';
	await message.client.sendMessage(message.jid,'*β Ultra Max Movie Hub β*\nπ¬πβ­β³π¨π»βπ»πποΈπβ' + '\nβ¬β¬β¬β¬β¬β¬β¬β¬β¬β¬β¬β¬β¬β¬β¬\n\n' + msg + '\n\nDownload Link : ' + payload.link, MessageType.text, { quoted: message.data });
}));