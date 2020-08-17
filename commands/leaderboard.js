const Discord = require('discord.js');
const db = require("quick.db");

exports.run = async(client, message, args) => {  
        let level = db.all().filter(data => data.ID.startsWith(`level_`)).sort((a, b) => b.data - a.data);
        if (!level.length) {
            let noEmbed = new Discord.RichEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                .setColor("RANDOM")
                .setDescription("Nothing To See Here Yet!")
            return message.channel.send(noEmbed)
        };

        level.length = 10;
        var content = "";
        for (var i in level) {
            if (level[i].data === null) level[i].data = 0
            content += `**${level.indexOf(level[i]) + 1}. ${client.users.get(level[i].ID.split('_')[2]) ? client.users.get(level[i].ID.split('_')[2]).tag : "Unknown User#0000"}** - ${level[i].data} 🏆\n`;
        };
        const embed = new Discord.RichEmbed()
            .setAuthor(`Leaderboard Of ${message.guild.name}`, client.user.avatarURL)
            .setColor("RANDOM")
            .setDescription(content)
            .setFooter(client.user.username)
            .setTimestamp()
        message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ldbr"],
  permLevel: 0
};

exports.help = {
  name:"leaderboard",
  usage: "leaderboard"
};