/* Copyright (C) 2021 Ultra Max.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

Ultra Max - Supun Max
*/

const Max = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');
const Config = require('../config');
let LOL = Config.WORKTYPE == 'public' ? false : true

const Language = require('../language');
const Lang = Language.getString('conventer');
const eng = `ð ð® *Media Editors* ð®ð \n\n` +
`ð® Command : *.mp4enhance*\n` +
`ð Description : Enhance videoâs quality.\n\n` +
`ð® Command : *.interp*\n` +
`ð Description : Increases the FPS of the video.\n\n` +
`ð® Command : *.mp4slowmo*\n` +
`ð Description : Applies true-slowmo to non-slow motion videos.\n\n` +
`ð® Command : *.x4mp4*\n` +
`ð Description : Reduce videoâs quality by 75%.\n\n` +
`ð® Command : *.x2mp4*\n` +
`ð Description : Reduce videoâs quality by 50%.\n\n` +
`ð® Command : *.gif*\n` +
`ð Description : Converts video to gif.\n\n` +
`ð® Command : *.agif*\n` +
`ð Description : Converts video to voiced gif.\n\n` +
`ð® Command : *.mp4blur*\n` +
`ð Description : Blurs the background of the video.\n\n` +
`ð® Command : *.mp4stab*\n` +
`ð Description : Decreases the vibration of the video.\n\n` +
`ð® Command : *.mp4rainbow*\n` +
`ð Description : Applies a rainbow effect to video.\n\n` +
`ð® Command : *.mp4color*\n` +
`ð Description : Makes the colors of the video more vivid and beautiful.\n\n` +
`ð® Command : *.mp4art*\n` +
`ð Description : Applies a art effect to the video.\n\n` +
`ð® Command : *.mp4negative*\n` +
`ð Description : Applies a negative color filter to the video.\n\n` +
`ð® Command : *.mp4vintage*\n` +
`ð Description : Applies a nostalgic effect to video.\n\n` +
`ð® Command : *.mp4bw*\n` +
`ð Description : Applies a monochrome effect to video.\n\n` +
`ð® Command : *.mp4reverse*\n` +
`ð Description : Plays the video in reverse.\n\n` +
`ð® Command : *.mp4edge*\n` +
`ð Description : Applies a edge effect to the video.\n\n` +
`ð® Command : *.mp4image*\n` +
`ð Description : Converts photo to 5 sec video.\n\n` +
`ð® Command : *.spectrum*\n` +
`ð Description : Converts the spectrum of sound into video.\n\n` +
`ð® Command : *.waves*\n` +
`ð Description : Converts the wave range of sound to video.\n\n` +
`ð® Command : *.frequency*\n` +
`ð Description : Converts the frequency range of sound to video.\n\n` +
`ð® Command : *.avec*\n` +
`ð Description : Converts the histogram of sound to video.\n\n` +
`ð® Command : *.volumeaudio*\n` +
`ð Description : Converts the decibel value of the sound into video.\n\n` +
`ð® Command : *.cqtaudio*\n` +
`ð Description : Converts the CQT value of audio to video.\n\n` +
`ð® Command : *.mp3eq*\n` +
`ð Description : Adjusts the sound to a crystal clear level.\n\n` +
`ð® Command : *.mp3crusher*\n` +
`ð Description : Distorts the sound, makes ridiculous.\n\n` +
`ð® Command : *.mp3reverse*\n` +
`ð Description : Plays the sound in reverse.\n\n` +
`ð® Command : *.mp3pitch*\n` +
`ð Description : Makes the sound thinner and faster.\n\n` +
`ð® Command  *.mp3low*\n` +
`ð Description : Makes the sound deep and slower.\n\n` +
`ð® Command : *.x2mp3*\n` +
`ð Description : Makes the sound twice as fast.\n\n` +
`ð® Command : *.mp3volume*\n` +
`ð Description : Increase sound level so much.\n\n` +
`ð® Command : *.bwimage*\n` +
`ð Description : Applies a monochrome effect to image.\n\n` +
`ð® Command : *.vintageimage*\n` +
`ð Description : Applies a vinatge effect to video.\n\n` +
`ð® Command : *.edgeimage*\n` +
`ð Description : Applies a edge effect to the photo.\n\n` +
`ð® Command : *.enhanceimage*\n` +
`ð Description : Makes the photo clearer.\n\n` +
`ð® Command : *.blurimage*\n` +
`ð Description : Blurs the background of the photo.\n\n` +
`ð® Command : *.grenimage*\n` +
`ð Description : Applies grain effect to the photo.\n\n` +
`ð® Command : *.negativeimage*\n` +
`ð Description : Applies a negative color filter to the photo.\n\n` +
`ð® Command : *.rainbowimage*\n` +
`ð Description : Applies rainbow effect to the photo.\n\n` +
`ð® Command : *.colorimage*\n` +
`ð Description : It makes the colors of the photo more vivid and attractive.\n\n` +
`ð® Command : *.artimage*\n` +
`ð Description : Applies a art effect to the photo.\n\n` +
`Check Youtube Channel : https://www.youtube.com/channel/UCLziWEeJ-VZuUnZaFUIYTOA?sub_confirmation=1/`

const sin = `ð ð® *à¶¸à·à¶°à·âà¶º à·à¶à·à·à¶à·à¶»à¶* ð®ð \n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4enhance*\n` +
`ð ð® * à¶¸à·à¶°à·à¶º à·à¶à·à·à¶à·à¶»à¶* ð®ð \n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4enhance*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶à·à¶«à·à¶­à·à¶¸à¶à¶·à·à·à¶º à·à·à¶©à· à¶¯à·à¶ºà·à¶«à· à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.interp*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à·à· FPS à·à·à¶©à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4slowmo*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à·à¶³à·à· slow-motion à·à·à¶¯à¶±à· à¶à¶­.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.x4mp4*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶à·à¶«à·à¶­à·à¶¸à¶à¶·à·à·à¶º 75%à¶à·à¶±à· à¶à¶©à· à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.x2mp4*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶à·à¶«à·à¶­à·à¶¸à¶à¶·à·à·à¶º 50%à¶à·à¶±à· à¶à¶©à· à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.gif*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à· gif à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.agif*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à· voiced gif à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4blur*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà· à¶´à·à·à¶¶à·à¶¸ à¶¶à·à¶³ à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4stab*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à·à· à¶à¶¸à·à¶´à¶±à¶º à¶à¶©à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4rainbow*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¯à·à¶¯à·à¶±à· à¶¶à¶½à¶´à·à¶¸à¶à· à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà¶§ à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4color*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à·à· à·à¶»à·à¶« à·à¶©à·à¶­à· à·à·à¶ à·à¶­à·à¶» à·à· à¶½à·à·à·à¶± à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4art*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à· à·à¶³à·à· à¶à¶½à·à¶­à·à¶¸à¶ à¶¶à¶½à¶´à·à¶¸à¶à· à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4negative*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à·à¶§ à·à·à¶« à·à¶»à·à¶« filter à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4vintage*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà¶§ à·à·à¶à·à¶» à·à·à¶à·à¶¸à¶à· à¶ºà·à¶¯à·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4bw*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à·à¶³à·à· Supun and white effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4reverse*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà·à· reverse à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4edge*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà¶§ edge effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp4image*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à¶­à¶­à·à¶´à¶» 5 à¶ à·à·à¶©à·à¶ºà·à·à¶à· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.spectrum*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯ à·à¶½ à·à¶»à·à¶«à·à·à¶½à·à¶º à·à·à¶©à·à¶ºà· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.waves*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶ºà· à¶­à¶»à¶à¶ à¶´à¶»à·à·à¶º à·à·à¶©à·à¶ºà· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.frequency*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶ºà· à·à¶à¶à·à¶ºà·à¶­ à¶´à¶»à·à·à¶º à·à·à¶©à·à¶ºà· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.avec*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶ºà· à·à·à·à·à¶§à·à¶à·à¶»à·à¶¸à· à·à·à¶©à·à¶ºà· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.volumeaudio*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶ºà· à¶©à·à·à·à¶¶à¶½à· à¶à¶à¶º à·à·à¶©à·à¶ºà· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.cqtaudio*\n` +
`ð à·à·à·à·à¶­à¶» : CQT à¶à¶à¶º à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà¶à· à¶¶à·à¶§ à¶´à¶»à·à·à¶»à·à¶­à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp3eq*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º à¶´à·à·à·à¶¯à·à¶½à· à¶´à·à·à·à¶¯à·à¶½à· à¶¸à¶§à·à¶§à¶¸à¶à¶§ à·à¶à·à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp3crusher*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º à·à·à¶à·à¶­à· à¶à¶»à¶ºà·, à·à·à·à·à¶º à¶à¶´à¶¯à·à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp3reverse*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º reverse à·à·à¶¯à¶±à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp3pitch*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º à¶­à·à¶±à· à·à· à·à·à¶à·à¶­à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º  *.mp3low*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º à¶à·à¶¹à·à¶»à· à·à· à¶¸à¶±à·à¶¯à¶à·à¶¸à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.x2mp3*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯à¶º à¶¸à·à¶±à· à¶¯à·à¶à·à¶«à¶ºà¶à· à·à·à¶à·à¶­à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.mp3volume*\n` +
`ð à·à·à·à·à¶­à¶» : à·à¶¶à·à¶¯ à¶¸à¶§à·à¶§à¶¸ à¶à¶­à¶»à¶¸à· à·à·à¶©à· à¶à¶»à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.bwimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶»à·à¶´à¶ºà¶§ Supun and white effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.vintageimage*\n` +
`ð à·à·à·à·à¶­à¶» : à·à·à¶©à·à¶ºà· à¶´à¶§à¶ºà¶§ vintage effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.edgeimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶ºà·à·à· edge effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.enhanceimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à·à¶©à·à¶­à· à¶´à·à·à·à¶¯à·à¶½à· à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.blurimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶ºà· à¶´à·à·à¶¶à·à¶¸ à¶¶à·à¶³ à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.grenimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à·à¶³à·à· grain effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.negativeimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à·à¶³à·à· à·à·à¶« à·à¶»à·à¶« filter à¶ºà·à¶¯à¶±à·à¶±.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.rainbowimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à·à¶³à·à· à¶¯à·à¶¯à·à¶±à·à¶± filter à¶ºà·à¶¯à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.colorimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶à¶¸à¶à·à¶±à· à¶¡à·à¶ºà·à¶»à·à¶´à¶ºà· à·à¶»à·à¶« à·à¶©à·à¶­à· à·à·à¶ à·à¶­à·à¶» à·à· à¶à¶à¶»à·à·à¶«à·à¶º à¶à¶»à¶ºà·.\n\n` +
`ð® à·à·à¶°à·à¶±à¶º : *.artimage*\n` +
`ð à·à·à·à·à¶­à¶» : à¶¡à·à¶ºà·à¶»à·à¶´à¶º à·à¶³à·à· art effect à¶ºà·à¶¯à¶ºà·.\n\n` +
`Check Youtube Channel : https://www.youtube.com/channel/UCLziWEeJ-VZuUnZaFUIYTOA?sub_confirmation=1/`


if (Config.LANG == 'EN') {
    if (Config.WORKTYPE == 'private') {
         Max.applyCMD({pattern: 'editor', fromMe: true,  deleteCommand: false, desc: Lang.XMEDÄ°A_DESC}, (async (message, match) => {    
            await message.client.sendMessage(message.jid,eng, MessageType.text,{quoted: message.data});
        }));
    }
    
    else if (Config.WORKTYPE == 'public') {
        Max.applyCMD({pattern: 'editor', fromMe: false, desc: Lang.XMEDÄ°A_DESC}, (async (message, match) => {    
            await message.client.sendMessage(message.jid,eng, MessageType.text,{quoted: message.data});
        }));
    }
}
    
if (Config.LANG == 'SI') {
    if (Config.WORKTYPE == 'private') {
        Max.applyCMD({pattern: 'editor', fromMe: true,  deleteCommand: false, desc: Lang.XMEDÄ°A_DESC}, (async (message, match) => {    
            await message.client.sendMessage(message.jid,sin, MessageType.text,{quoted: message.data});
        }));
    }
    
    else if (Config.WORKTYPE == 'public') {
        Max.applyCMD({pattern: 'editor', fromMe: false, desc: Lang.XMEDÄ°A_DESC}, (async (message, match) => {    
            await message.client.sendMessage(message.jid,sin, MessageType.text,{quoted: message.data});
        }));
    }
}

    Max.applyCMD({pattern: 'x4mp4', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message.video) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .withSize('25%')
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'x2mp4', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message.video) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
           },
            message: message.reply_message.data.quotedMessage
        });

       ffmpeg(location)
            .withSize('50%')
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4image', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message.image) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .loop(6)
            .fps(19)
            .videoBitrate(400)
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'spectrum', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "[0:a]showspectrum=s=720x1280,format=yuv420p[v]", "-map", "[v]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'waves', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "[0:a]showwaves=s=720x1280:mode=cline:rate=25,format=yuv420p[v]", "-map", "[v]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'frequency', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
            var location = await message.client.downloadAndSaveMediaMessage({
                key: {
                    remoteJid: message.reply_message.jid,
                    id: message.reply_message.id
                },
                message: message.reply_message.data.quotedMessage
            });

            ffmpeg(location)
                .outputOptions(["-y", "-filter_complex", "[0:a]showfreqs=s=720x1280:mode=cline:fscale=log,format=yuv420p[v]", "-map", "[v]", "-map 0:a"])
                .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'avec', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   
 
        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "[0:a]avectorscope=s=720x1280:rf=5:gf=25:bf=5:draw=line,format=yuv420p[v]", "-map", "[v]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'volumeaudio', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'cqtaudio', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
    
        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "[0:a]showcqt=s=1280x720,format=yuv420p[v]", "-map", "[v]", "-map 0:a"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3eq', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-af", "superequalizer=1b=10:2b=10:3b=1:4b=5:5b=7:6b=5:7b=2:8b=3:9b=4:10b=5:11b=6:12b=7:13b=8:14b=8:15b=9:16b=9:17b=10:18b=10[a];[a]loudnorm=I=-16:TP=-1.5:LRA=14", "-ar 48k"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3crusher', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
    
        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3reverse', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter_complex", "areverse"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4vintage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "curves=vintage,format=yuv420p"])
            .fps(22)
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4reverse', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "reverse", "-af", "areverse"])
            .format('mp4')
            .fps(22)
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4bw', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "hue=s=0"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'bwimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "hue=s=0"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
        });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'vintageimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "curves=vintage"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4enhance', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "unsharp=3:3:1.5"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'blurimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4blur', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
    
        ffmpeg(location)
            .outputOptions(["-y", "-vf", "split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2"])
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3pitch', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-af", "asetrate=44100*1.3"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4edge', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```Edging Video..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-codec:v", "mpeg4", "-filter:v", "edgedetect=low=0.9:high=0.3"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3low', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-af", "asetrate=44100*0.9"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'x2mp3', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter:a", "atempo=2.0", "-vn"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'edgeimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need Photo*');
        var downloading = await message.client.sendMessage(message.jid,'```Edging Image..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter:v", "edgedetect=low=0.9:high=0.2"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'enhanceimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "unsharp=3:3:1.5"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp3volume', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => { 
   
        if (message.reply_message === false) return await message.sendMessage('*Need a audio file!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-filter:a", "volume=5.3"])
            .save('output.mp3')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    })); 

    Max.applyCMD({pattern: 'gif', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('Need a video!');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing to Gif..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .noAudio()
            .fps(13)
            .videoBitrate(500)
            .save('output_gif.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output_gif.mp4'), MessageType.video, {mimetype: Mimetype.gif, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'agif', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('Need a video!');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing to Gif..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .fps(13)
                .videoBitrate(500)
                .save('output_gif.mp4')
                .on('end', async () => {
                    await message.sendMessage(fs.readFileSync('output_gif.mp4'), MessageType.video, {mimetype: Mimetype.gif, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
                });
            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'grenimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   

        if (message.reply_message === false) return await message.sendMessage('Need a photo!!');
        var downloading = await message.client.sendMessage(message.jid,'```Adding Gren..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .videoFilters('noise=alls=100:allf=t+u')
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'interp ?(.*)', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message.video) return await message.sendMessage('*Need Video and FPS Value!*\nEx: ```.interp 100```');
        if (message.reply_message.video && match[1] <= 10) return await message.sendMessage('*Low FPS Value â ï¸*\n*Please, type over 10*');
        if (message.reply_message.video && match[1] >= 500) return await message.sendMessage('*High FPS Value â ï¸*\n*Please, type under 500*')
   
        var downloading = await message.client.sendMessage(message.jid,'```Interpolating..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
        await message.sendMessage('_This process may take a while.._');

        ffmpeg(location)
            .videoFilters(`minterpolate=fps=${match[1]}:mi_mode=mci:me_mode=bidir`)
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {caption: `Copyright Â© 2021 | Ultra Max\n_Interpolated to ${match[1]} FPS_`});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'rainbowimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)"])
            .videoFilters('eq=brightness=0.5')
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4rainbow', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)", "-pix_fmt yuv420p"])
            .videoFilters('eq=brightness=0.5')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'negativeimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "curves=color_negative"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4negative', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "curves=color_negative,format=yuv420p"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4art', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
    
    ffmpeg(location)
            .outputOptions(["-y", "-vf", "convolution=-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2,format=yuv420p"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'artimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "convolution=-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4stab', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "deshake,format=yuv420p"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4color', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "eq=contrast=1.3:saturation=1.5:brightness=-0.1,format=yuv420p"])
            .format('mp4')
            .save('output.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.mp4'), MessageType.video, {mimetype: Mimetype.mpeg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'colorimage', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('*Need a photo!!*');
        var downloading = await message.client.sendMessage(message.jid,'```ðª Media editing..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .outputOptions(["-y", "-vf", "eq=contrast=1.3:saturation=1.5:brightness=-0.1"])
            .save('output.jpg')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg, caption: Config.CAP, quoted: message.data, thumbnail: thumb });
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));

    Max.applyCMD({pattern: 'mp4slowmo', fromMe: LOL, deleteCommand: false,dontAddCommandList: true}, (async (message, match) => {    

        if (!message.reply_message.video) return await message.sendMessage('*Need a video!*');
        var downloading = await message.client.sendMessage(message.jid,'```Motion Render Interpolating..```',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        await message.client.sendMessage(message.jid, '_This process may take a while.._', MessageType.text);

        ffmpeg(location)
            .videoFilters('minterpolate=fps=120')
            .videoFilters('setpts=4*PTS')
            .noAudio()
            .format('mp4')
            .save('slowmo.mp4')
            .on('end', async () => {
                await message.sendMessage(fs.readFileSync('slowmo.mp4'), MessageType.video, {caption: 'True Slow-Motion by Ultra Max'});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: LOL})
    }));


const thumb = "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"