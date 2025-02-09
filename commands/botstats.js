const Discord = require('discord.js')
const settings = require('../settings.json');
const fs = require('fs');
const os = require('os');
const customisation = require('../customisation.json');
//const si = require('systeminformation');
const osutils = require('os-utils');
const db = require('quick.db')

exports.run = async (client, message) => {
  
  var milliseconds = parseInt((client.uptime % 1000) / 100),
        seconds = parseInt((client.uptime / 1000) % 60),
        minutes = parseInt((client.uptime / (1000 * 60)) % 60),
        hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24),
        days = parseInt((client.uptime / (1000 * 60 * 60 * 24)) % 60);

        days = (days < 10) ? "0" + days : days;
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        fs.readdir('./commands/', async (err, files) => {
          if (err) console.error(err);
          let totcmds = files.length;
  let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) {
      prefix = 'b!'
    }
  let globalprefix = settings.prefix;
  osutils.cpuUsage(function(v) {
    const embed = new Discord.RichEmbed()
    .setColor(0x7289DA)
    .setThumbnail(`https://media.discordapp.net/attachments/719240757071970386/737626355600195654/USIRP.png?size=2048`)
    .setURL(`https://media.discordapp.net/attachments/719240757071970386/737626355600195654/USIRP.png?size=2048`)
    .setTimestamp()
    .addField("Unity State Indonesia Bot", "Show the bot's stats.")
    .addField("--------------------------------------------------------------------------------","------------------------------------------------------------------------------")
    .addField("Total Servers", `${client.guilds.size}`, true)
    .addField("Server Prefix", prefix, true)
    .addField("Total Channels", `${client.channels.size}`, true)
    .addField("Global Prefix", globalprefix, true)
    .addField("Total Users", `${client.users.size}`, true)
    .addField("Total Commands", `${totcmds} commands`, true)
    .addField("Bot Version", "3.5.0", true)
    .addField("Library", "Discord.js", true)
    .addField("Ping", Math.round(client.ping) + "ms", true)
    .addField("Uptime", days + "d " + hours + "h " + minutes + "m " + seconds + "." + milliseconds + "s", true)
    .addField("Developer", `${customisation.ownername}`, true)
    .setFooter(`${customisation.copy} By ${customisation.ownername}`);
        message.channel.send({embed});
  })
})
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['stats'],
  permLevel: 0
};

exports.help = {
  name: 'botstats',
  description: 'Displays bot\'s stats.',
  usage: 'botstats'
};