/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const Max = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const {spawnSync} = require('child_process');
const Config = require('../config');
const chalk = require('chalk');
const axios = require('axios');
let LOL = Config.WORKTYPE == 'public' ? false : true

const Language = require('../language');
const Lang = Language.getString('system_stats');



Max.applyCMD({pattern: 'rules', fromMe: LOL,  deleteCommand: false, onlyGroup: true, desc: Lang.RULE_DESC}, (async (message, match) => {

    if (Config.RULES == 'default') {
            
        var image = await axios.get (Config.ALIVE_LOGO, {responseType: 'arraybuffer'})
       
    await message.client.sendMessage (message.jid, Buffer.from (image.data), MessageType.image, {mimetype: Mimetype.png, caption: '⚜️ *⟪Group Rules⟫* ⚜️\n\n' + Lang.rules})

    }
    else {
            
        var image = await axios.get (Config.ALIVE_LOGO, {responseType: 'arraybuffer'})
       
        await message.client.sendMessage (message.jid, Buffer.from (image.data), MessageType.image, {mimetype: Mimetype.png, caption: '⚜️ *⟪Group Rules⟫* ⚜️\n\n' + Config.RULES })
    }
}));