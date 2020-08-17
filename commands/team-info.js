const Discord = require('discord.js')
const fs = require("fs");
const customisation = require('../customisation.json');

exports.run = (client, message) => {
  let info = JSON.parse(fs.readFileSync("./halloffame.json", "utf8"));
  const embed = new Discord.RichEmbed()
  .setThumbnail(message.guild.iconURL)
  .setColor(Math.floor(Math.random()*16777215))
  .setTitle(`>> _____${message.guild.name} Team_____ <<`, '')
  .addField('**__Owner Bot__**', `\`${customisation.ownername}\``)
  .addField('**__Administrator__**', info.bigfam)
  .addField('**__Staff__**', info.smolfam)
  .setTimestamp();
  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'team-info',
  description: 'Bot contributors!',
  usage: 'team-info'
};