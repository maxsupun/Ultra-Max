/*
Copyright (C) 2021 Ultra Max.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Ultra Max - Supun Max
මේක copy කරන උබේ අම්මා වේස බඩුවක්. මකබැවියන් copy ගහන හුට්ටිගේ පුතා.
මේක උස්සන් ගියොත් උබ රෙනකොට වැටිච්ච අවජාතකයෙක් - COnfirmed!!
*/


//Basic requirements
const Max = require('../events');
const UltraMax = require('UltraMax-public-1');
const {MessageType} = require('@adiwajshing/baileys');
const axios = require('axios');
const got = require("got");

// Config Checker
const Config = require('../config');
let LOL = Config.WORKTYPE == 'public' ? false : true

//Language
const Language = require('../language');
const Lang = Language.getString('lyric');


Max.applyCMD({pattern: 'lyric ?(.*)', fromMe: LOL, desc: Lang.LY_DESC,  deleteCommand: false}, async (message, match) => {
    const song = match[1]

    if (song === 'xx') return await message.client.sendMessage(message.jid, Lang.NEED_WORD, MessageType.text, {quoted: message.data});

    var payload = await UltraMax.lyrics(song)
    try {
        await message.client.sendMessage(message.jid, '*Song name :* ' + song + '\n\n' + payload.lyr, MessageType.text, {quoted: message.data});
    } catch {
        return await message.client.sendMessage(message.jid, Lang.NO_RESULT, MessageType.text, {quoted: message.data});
    }
});
