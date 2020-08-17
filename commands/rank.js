const Discord = require('discord.js');
const superagent = require("superagent");
const request = require("request");
const { createCanvas, registerFont } = require('canvas')
const { Canvas } = require("canvas-constructor");
const sql = require('sqlite');
const fetch = require("node-superfetch");
const fs = require("fs");
const db = require("quick.db");
const Canvacord  = require("canvacord");
const canva = new Canvacord();

exports.run = async(client, message, args) => {       
      let member = message.mentions.users.size ? message.mentions.users.first() : message.member;
      if (member.bot) return message.reply("Bot do not have levels!");
      let nameLimit = member.user.username;
      let username = nameLimit.length > 25 ? nameLimit.substring(0, 23) + "" : nameLimit;
  
      let xp = db.fetch(`messages_${message.guild.id}_${member.id}`)
      let lvl = db.fetch(`level_${message.guild.id}_${member.id}`)
      
      if (lvl === null) lvl = "0"
      if (xp === null) xp = "0"
    
      let curxp = xp;
      let curlvl = lvl;
      let nxtLvlXp = curlvl * 100;
      let difference = nxtLvlXp + 100 - curxp;
  
      let image = await canva.rank({ 
            username: username, 
            discrim: member.user.discriminator, 
            level: curlvl, 
            rank: "##", 
            neededXP: difference, 
            currentXP: curxp, 
            avatarURL: member.user.displayAvatarURL, 
            color: "white", 
            background: "https://cdn.discordapp.com/attachments/730191712911097896/732541650001330186/rankcard.png",
            overlay: true,
            status: member.presence.status.toUpperCase(),
            gradient: curxp / nxtLvlXp
        });
      let attachment = new Discord.Attachment(image, "rank.png");
      return message.channel.send(attachment);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["level"],
  permLevel: 0
};

exports.help = {
  name: "rank",
  usage: "rank"
};