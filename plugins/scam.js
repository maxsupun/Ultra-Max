/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const Max = require('../events');
const {MessageType, MessageOptions, Mimetype, Presence} = require('@adiwajshing/baileys');

const Language = require('../language');
const Lang = Language.getString('scam');

Max.applyCMD({pattern: 'scam ?(.*)', fromMe: true,  deleteCommand: false,  desc: Lang.SCAM_DESC, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') {

        return await message.sendMessage(Lang.SCAM_NOTFOUND);

    } else if (match[1] === 'typing') {

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.composing)

    } else if (match[1] === 'online') {

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.available)

    } else if (match[1] === 'recording') {

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

        await new Promise(r => setTimeout(r, 10000));

        await message.client.updatePresence(message.jid,Presence.recording)

    } else if (match[1] === 'stop') {

        return await message.client.updatePresence(message.jid,Presence.paused)

    } else {

        await message.sendMessage(Lang.SCAM_NULL);

    }

}));
