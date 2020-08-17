const Discord = require("discord.js");
const settings = require('../settings.json');

exports.run = async(client, message, args) => {

if (message.author.id !== "482706815784714272") 
  return message.reply('Anda bukan developer bot ini!')
  .then(m => m.delete(5000));

let image = message.attachments.first().url;
client.user.setAvatar(image);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'setavatar',
  description: 'To change avatar bot',
  usage: 'setavatar [send_image/link_image]' 
};