const Discord = require('discord.js');
const help = require('../data/helpMsgs.json');
const customisation = require('../customisation.json');
const settings = require('../settings.json');
const fs = require('fs');

exports.run = async(client, message, args) => {
  if (!args.length) {
      const embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(client.user.avatarURL)
          .setAuthor("Unity State Indonesia RolePlay", client.user.avatarURL)
          .addField('**HELP MENU**', 'Hallo saya Unity State Indonesia BOT Salam 👋. Dan di bawah ini ada beberapa fitur dari saya')
          .addField('**ADMINISTRATOR**', help.helpMsg1)
          .addField('**INFORMATION**', help.helpMsg2)
          .addField('**GIVEWAY**', help.helpMsg3)
          .addField('**MUSIC**', help.helpMsg4)
          .addField('**OWNER BOT**', help.helpMsg5)
          .addField('#Note', `type //help <command name> for help`)     
          .setFooter(`${customisation.copy} By ${customisation.ownername}`, client.user.avatarURL);

       message.channel.send(embed);

    } else {
      let command = args[0];
      if (client.commands.has(command.toLowerCase())) {
        command = client.commands.get(command.toLowerCase());
        const embed1 = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(client.user.avatarURL)
          .setAuthor(`Help ${command.help.name} Commands`, client.user.avatarURL)
          .addField("Description", `${command.help.description ? command.help.description : "None"}`)
          .addField("Usage", `${command.help.usage ? command.help.usage : "None"}`)
          .setFooter(`${customisation.copy}`);
        return message.channel.send(embed1).catch(console.error);
      } else if (client.aliases.has(command.toLowerCase())) {
        command = client.commands.get(client.aliases.get(command.toLowerCase()));
        const embed2 = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(client.user.avatarURL)
          .setAuthor(`Help ${command.help.name} Commands`, client.user.avatarURL)
          .addField("Description", `${command.help.description ? command.help.description : "None"}`)
          .addField("Usage", `${command.help.usage ? command.help.usage : "None"}`)
          .setFooter(`${customisation.copy}`);
        return message.channel.send(embed2).catch(console.error);
      } else {
        return message.reply(`${command} command is missing, type the \`//help [command]\` to find out what commands are available!`);        
      }
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};