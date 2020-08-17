const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE"] });

module.exports = channel => {
  if (channel.type == "dm") return;
  let guilds = channel.guild;
  if (!channel.partial) {
    const modlog = guilds.channels.find("name", "【🛰】ʙᴏᴛ-ʟᴏɢs");
    if (modlog) {
      let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setThumbnail(channel.guild.iconURL)
        .setAuthor("🗑️ Channel Deleted")
        .addField("Channel", channel.name, true)
        .addField("Type", channel.type, true)
        .addField("Position", channel.position, true);

      modlog.send({embed});
    }
  }
};