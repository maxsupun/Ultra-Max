/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const {MessageType, GroupSettingChange, ChatModification, WAConnectionTest} = require('@adiwajshing/baileys');
const Max = require('../events');
const Config = require('../config');
const got = require("got");

const Language = require('../language');
const Lang = Language.getString('admin');
const mut = Language.getString('mute');

async function checkImAdmin(message, user = message.client.user.jid) {
    var grup = await message.client.groupMetadata(message.jid);
    var sonuc = grup['participants'].map((member) => {
        if (member.id.split('@')[0] === user.split('@')[0] && member.isAdmin) return true; else; return false;
    });
    return sonuc.includes(true);
}

Max.applyCMD({pattern: 'admin', desc: Lang.ADMINDESC, fromMe: true, dontAddCommandList: false, deleteCommand: false}, (async (message, match) => {    

    await message.sendMessage(Lang.AD_DESC);
}));

Max.applyCMD({pattern: 'ban ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.BAN_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {  
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.BANMSG == 'default') {
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + '```, ' + Lang.BANNED + '```', MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupRemove(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + '```, ' + Lang.BANNED + '```', MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupRemove(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.BANMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupRemove(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.BANMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupRemove(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

Max.applyCMD({pattern: 'add(?: |$)(.*)', fromMe: true, onlyGroup: true, desc: Lang.ADD_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {  
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.ADDMSG == 'default') {
        if (match[1] !== '') {
            match[1].split(' ').map(async (user) => {
                await message.client.groupAdd(message.jid, [user + "@s.whatsapp.net"]);
                await message.client.sendMessage(message.jid,'```' + user + ' ' + Lang.ADDED +'```', MessageType.text);
            });
        } 
        else if (match[1].includes('+')) {
            return await message.client.sendMessage(message.jid,Lang.WRONG,MessageType.text);
        }
        else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (match[1] !== '') {
            match[1].split(' ').map(async (user) => {
                await message.client.groupAdd(message.jid, [user + "@s.whatsapp.net"]);
                await message.client.sendMessage(message.jid,'```' + user + '``` ' + Config.ADDMSG, MessageType.text);
            });
        }
        else if (match[1].includes('+')) {
            return await message.client.sendMessage(message.jid,Lang.WRONG,MessageType.text);
        }
        else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

Max.applyCMD({pattern: 'promote ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.PROMOTE_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {    
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.PROMOTEMSG == 'default') {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant);
            if (checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Lang.PROMOTED, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupMakeAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Lang.PROMOTED, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupMakeAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant);
            if (checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.PROMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupMakeAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_PROMOTED, MessageType.text);
                }

                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.PROMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupMakeAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

Max.applyCMD({pattern: 'demote ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.DEMOTE_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {    
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN);

    if (Config.DEMOTEMSG == 'default') {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant.split('@')[0]);
            if (!checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Lang.DEMOTED, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupDemoteAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (!checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
                }
            
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Lang.DEMOTED, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupDemoteAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
    else {
        if (message.reply_message !== false) {
            var checkAlready = await checkImAdmin(message, message.reply_message.data.participant.split('@')[0]);
            if (!checkAlready) {
                return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
            }

            await message.client.sendMessage(message.jid,'@' + message.reply_message.data.participant.split('@')[0] + Config.DEMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: [message.reply_message.data.participant]}});
            await message.client.groupDemoteAdmin(message.jid, [message.reply_message.data.participant]);
        } else if (message.reply_message === false && message.mention !== false) {
            var etiketler = '';
            message.mention.map(async (user) => {
                var checkAlready = await checkImAdmin(message, user);
                if (!checkAlready) {
                    return await message.client.sendMessage(message.jid,Lang.ALREADY_NOT_ADMIN, MessageType.text);
                }
            
                etiketler += '@' + user.split('@')[0] + ',';
            });

            await message.client.sendMessage(message.jid,etiketler + Config.DEMOTEMSG, MessageType.text, {contextInfo: {mentionedJid: message.mention}});
            await message.client.groupDemoteAdmin(message.jid, message.mention);
        } else {
            return await message.client.sendMessage(message.jid,Lang.GIVE_ME_USER,MessageType.text);
        }
    }
}));

Max.applyCMD({pattern: 'mute ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.MUTE_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {    
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.MUTEMSG == 'default') {
        if (match[1] == '') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Lang.MUTED,MessageType.text);
        }
        else if (match[1] == '1m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.B??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 60000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '2m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 120000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '3m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 180000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '4m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.D??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 240000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '5m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.BE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 300000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '6m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 360000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '7m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.YED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 420000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '8m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 480000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '9m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.DOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 540000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '10m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '11m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 660000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '12m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ON??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 720000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '13m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ON????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 780000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '14m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OND??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 840000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '15m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONBE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 900000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '16m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 960000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '17m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONYED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1020000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '18m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONSEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1080000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '19m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ONDOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1140000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '20m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '21m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??B??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1260000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '22m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM????K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1320000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '23m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1380000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '24m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??D??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1440000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '25m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??BE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1500000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '26m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??ALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1560000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '27m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??YED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1620000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '28m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??SEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1680000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '29m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.Y??RM??DOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1740000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '30m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '31m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1860000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '32m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZ??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1920000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '33m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZ????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 1980000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '34m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZD??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2040000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '35m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZBE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2100000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '36m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2160000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '37m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZYED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2220000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '38m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZSEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2280000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '39m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.OTUZDOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2340000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '40m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '41m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2460000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '42m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRK??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2520000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '43m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRK????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2580000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '44m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKD??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2640000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '45m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKBE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2700000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '46m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2760000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '47m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKYED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2820000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '48m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKSEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2880000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '49m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.KIRKDOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 2940000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '50m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '51m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??B??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3060000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '52m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL????K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3120000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '53m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3180000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '54m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??D??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3240000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '55m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??BE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3300000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '56m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??ALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3360000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '57m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??YED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3420000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '58m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??SEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3480000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '59m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.ELL??DOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3540000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '1h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 3600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '2h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAAT??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 7200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '3h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAAT????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 10800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '4h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATD??RTMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 14400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '5h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATBE??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 18000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '6h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATALTIMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 21600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '7h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATYED??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 25200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '8h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATSEK??ZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 28800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '9h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATDOKUZMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 32400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '10h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATONMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 36000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '11h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATONB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 39600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '12h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.SAATON??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 43200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '1d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.G??NB??RMUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 86400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '2d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.G??N??K??MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 172800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] == '3d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,mut.G??N????MUTE,MessageType.text);

            await new Promise(r => setTimeout(r, 259200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
        }
        else if (match[1] !== '1m' || match[1] !== '2m' || match[1] !== '3m' || match[1] !== '4m' || match[1] !== '5m' || match[1] !== '6m' || match[1] !== '7m' || match[1] !== '8m' || match[1] !== '9m' || match[1] !== '10m' || match[1] !== '11m' || match[1] !== '12m' || match[1] !== '13m' || match[1] !== '14m' || match[1] !== '15m' || match[1] !== '16m' || match[1] !== '17m' || match[1] !== '18m' || match[1] !== '19m' || match[1] !== '20m' || match[1] !== '21m' || match[1] !== '22m' || match[1] !== '23m' || match[1] !== '24m' || match[1] !== '25m' || match[1] !== '26m' || match[1] !== '27m' || match[1] !== '28m' || match[1] !== '29m' || match[1] !== '30m' || match[1] !== '31m' || match[1] !== '32m' || match[1] !== '33m' || match[1] !== '34m' || match[1] !== '35m' || match[1] !== '36m' || match[1] !== '37m' || match[1] !== '38m' || match[1] !== '39m' || match[1] !== '40m' || match[1] !== '41m' || match[1] !== '42m' || match[1] !== '43m' || match[1] !== '44m' || match[1] !== '45m' || match[1] !== '46m' || match[1] !== '47m' || match[1] !== '48m' || match[1] !== '49m' || match[1] !== '50m' || match[1] !== '51m' || match[1] !== '52m' || match[1] !== '53m' || match[1] !== '54m' || match[1] !== '55m' || match[1] !== '56m' || match[1] !== '57m' || match[1] !== '58m' || match[1] !== '59m' || match[1] !== '1h' || match[1] !== '2h' || match[1] !== '3h' || match[1] !== '4h' || match[1] !== '5h' || match[1] !== '6h' || match[1] !== '7h' || match[1] !== '8h' || match[1] !== '9h' || match[1] !== '10h' || match[1] !== '11h' || match[1] !== '12h' || match[1] !== '1d' || match[1] !== '2d' || match[1] !== '3d') {
            return await message.client.sendMessage(message.jid, mut.T??R, MessageType.text);
        }
    }
    else {
        if (match[1] == '') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid, Config.MUTEMSG,MessageType.text);
        }
        else if (match[1] == '1m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 60000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '2m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 120000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '3m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 180000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '4m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 240000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '5m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 300000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '6m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 360000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '7m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 420000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '8m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 480000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '9m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 540000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '10m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '11m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 660000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '12m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 720000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '13m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 780000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '14m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 840000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '15m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 900000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '16m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 960000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '17m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1020000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '18m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1080000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '19m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1140000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '20m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '21m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1260000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '22m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1320000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '23m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1380000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '24m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1440000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '25m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1500000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '26m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1560000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '27m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1620000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '28m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1680000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '29m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1740000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '30m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '31m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1860000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '32m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1920000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '33m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 1980000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '34m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2040000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '35m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2100000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '36m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2160000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '37m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2220000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '38m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2280000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '39m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2340000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '40m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '41m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2460000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '42m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2520000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '43m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2580000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '44m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2640000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '45m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2700000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '46m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2760000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '47m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2820000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '48m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2880000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '49m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 2940000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '50m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '51m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3060000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '52m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3120000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '53m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3180000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '54m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3240000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '55m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3300000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '56m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3360000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '57m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3420000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '58m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3480000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '59m') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3540000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '1h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 3600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '2h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 7200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '3h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 10800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '4h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 14400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '5h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 18000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '6h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 21600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '7h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 25200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '8h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 28800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '9h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 32400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '10h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 36000000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '11h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 39600000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '12h') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 43200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '1d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 86400000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '2d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 172800000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] == '3d') {
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, true);
            await message.client.sendMessage(message.jid,Config.MUTEMSG,MessageType.text);

            await new Promise(r => setTimeout(r, 259200000));
    
            await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
            await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
        }
        else if (match[1] !== '1m' || match[1] !== '2m' || match[1] !== '3m' || match[1] !== '4m' || match[1] !== '5m' || match[1] !== '6m' || match[1] !== '7m' || match[1] !== '8m' || match[1] !== '9m' || match[1] !== '10m' || match[1] !== '11m' || match[1] !== '12m' || match[1] !== '13m' || match[1] !== '14m' || match[1] !== '15m' || match[1] !== '16m' || match[1] !== '17m' || match[1] !== '18m' || match[1] !== '19m' || match[1] !== '20m' || match[1] !== '21m' || match[1] !== '22m' || match[1] !== '23m' || match[1] !== '24m' || match[1] !== '25m' || match[1] !== '26m' || match[1] !== '27m' || match[1] !== '28m' || match[1] !== '29m' || match[1] !== '30m' || match[1] !== '31m' || match[1] !== '32m' || match[1] !== '33m' || match[1] !== '34m' || match[1] !== '35m' || match[1] !== '36m' || match[1] !== '37m' || match[1] !== '38m' || match[1] !== '39m' || match[1] !== '40m' || match[1] !== '41m' || match[1] !== '42m' || match[1] !== '43m' || match[1] !== '44m' || match[1] !== '45m' || match[1] !== '46m' || match[1] !== '47m' || match[1] !== '48m' || match[1] !== '49m' || match[1] !== '50m' || match[1] !== '51m' || match[1] !== '52m' || match[1] !== '53m' || match[1] !== '54m' || match[1] !== '55m' || match[1] !== '56m' || match[1] !== '57m' || match[1] !== '58m' || match[1] !== '59m' || match[1] !== '1h' || match[1] !== '2h' || match[1] !== '3h' || match[1] !== '4h' || match[1] !== '5h' || match[1] !== '6h' || match[1] !== '7h' || match[1] !== '8h' || match[1] !== '9h' || match[1] !== '10h' || match[1] !== '11h' || match[1] !== '12h' || match[1] !== '1d' || match[1] !== '2d' || match[1] !== '3d') {
            return await message.client.sendMessage(message.jid, mut.T??R, MessageType.text);
        }
    }
}));

Max.applyCMD({pattern: 'unmute ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.UNMUTE_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {    
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (Config.UNMUTEMSG == 'default') {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
        await message.client.sendMessage(message.jid,Lang.UNMUTED,MessageType.text);
    }
    else {
        await message.client.groupSettingChange(message.jid, GroupSettingChange.messageSend, false);
        await message.client.sendMessage(message.jid,Config.UNMUTEMSG,MessageType.text);
    }
}));

Max.applyCMD({pattern: 'clear', fromMe: true, desc: Lang.END, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {

    await message.sendMessage('```Chat clearing...```');
    await message.client.modifyChat (message.jid, ChatModification.delete);
    await message.sendMessage('```???? Chat cleared```');
}));

Max.applyCMD({pattern: 'subject ?(.*)', onlyGroup: true, fromMe: true, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN,MessageType.text);

    if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_SUB);
    
    await message.client.groupUpdateSubject(message.jid, match[1]);
    await message.client.sendMessage(message.jid,Lang.SUB,MessageType.text);
    }
));

Max.applyCMD({pattern: 'invite ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.INVITE_DESC, dontAddCommandList: true, deleteCommand: false}, (async (message, match) => {    
    var im = await checkImAdmin(message);
    if (!im) return await message.client.sendMessage(message.jid,Lang.IM_NOT_ADMIN, MessageType.text);
    var invite = await message.client.groupInviteCode(message.jid);
    await message.client.sendMessage(message.jid,Lang.INVITE + ' https://chat.whatsapp.com/' + invite, MessageType.text);
}));

Max.applyCMD({pattern: 'search ?(.*)', fromMe: true, desc: Lang.SEARCH, dontAddCommandList: true, deleteCommand: false}, async (message, match) => {
    const url = `https://gist.githubusercontent.com/maxsupun/a2b3e417d2ca059f4a6f64e6800dc41c/raw/`;
        const response = await got(url);
        const json = JSON.parse(response.body);
        if (response.statusCode === 200) return await message.client.sendMessage(message.jid, '*????Ultra Max supported plugins????*\n\nYou can install these plugins by *.install _<plugin_link>_*\nExample : .install https://gist.github.com/maxsupun/a06509cf406c3eb172e5173900d0ef87\n\n' + json.sinhala, MessageType.text);
});

module.exports = {
    checkImAdmin: checkImAdmin
};
