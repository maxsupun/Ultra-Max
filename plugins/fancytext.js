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
const got = require("got");

// Config Checker
const Config = require('../config');
let LOL = Config.WORKTYPE == 'public' ? false : true

//Language
const Language = require('../language');
const Lang = Language.getString('font');

Max.applyCMD({ pattern: 'fancy ?(.*)', fromMe: LOL, desc: Lang.FONT_DESC,  deleteCommand: false}, async (message, match) => {
    const name = match[1]

    if (name === 'xx') return await message.reply(Lang.NEED_WORD);
    var payload = await UltraMax.fancy(name)
   
    await message.client.sendMessage(message.jid, '*✨ Ultra Max Fancy Text ✨*' + '\n\n' + payload.cool, MessageType.text, {quoted: message.data});
})

