const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE'] });

module.exports = async(message) => { 
   if (message.author.bot) return;
   let guilds = message.guild;
     if(!message.partial) { 
     const modlog = guilds.channels.find('name', '【🛰】ʙᴏᴛ-ʟᴏɢs'); 
      if(modlog) { 
      const embed = new Discord.RichEmbed() 
           .setColor("RANDOM")
           .setThumbnail(message.author.avatarURL)
           .setAuthor(`${message.author.username} | Deleted Message`, message.author.avatarURL) 
           .addField('Author', `${message.author}`, true) 
           .addField('In Channel', `${message.channel}`, true) 
           .addField('Message Content', `${message.content}`, true) 
           .setTimestamp(); 
      modlog.send({embed});
     }
   }
};