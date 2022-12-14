/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const Max = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const Config = require('../config');

const Language = require('../language');
const Lang = Language.getString('tagall');

if (Config.WORKTYPE == 'private') {
    Max.applyCMD({pattern: 'tagadmin$', fromMe: true, desc: Lang.TAGADMΔ°N,  deleteCommand: false}, (async (message, match) => {
        let grup = await message.client.groupMetadata(message.jid);
        var jids = [];
        mesaj = '';
        grup['participants'].map(async (uye) => {
            if (uye.isAdmin) {
                mesaj += 'β π @' + uye.id.split('@')[0] + '\n';
                jids.push(uye.id.replace('c.us', 's.whatsapp.net'));
            }
        });
        await message.client.sendMessage(message.jid, 'βββββββββββββββββ\n' + 'β *π Group Admin List π*\n' + 'β \n' + mesaj + 'β \n' + 'βββββββββββββββββ', MessageType.extendedText, {contextInfo: {mentionedJid: jids}, previewType: 0})
    }));
}
else if (Config.WORKTYPE == 'public') {
    Max.applyCMD({pattern: 'tagadmin$', fromMe: false, desc: Lang.TAGADMΔ°N}, (async (message, match) => {
        let grup = await message.client.groupMetadata(message.jid);
        var jids = [];
        mesaj = '';
        grup['participants'].map(async (uye) => {
            if (uye.isAdmin) {
                mesaj += 'β π @' + uye.id.split('@')[0] + '\n';
                jids.push(uye.id.replace('c.us', 's.whatsapp.net'));
            }
        });
        await message.client.sendMessage(message.jid, 'βββββββββββββββββ\n' + 'β *π Group Admin List π*\n' + 'β \n' + mesaj + 'β \n' + 'βββββββββββββββββ', MessageType.extendedText, {contextInfo: {mentionedJid: jids}, previewType: 0})
    }));
}
