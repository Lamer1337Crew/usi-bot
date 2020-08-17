const Discord = require("discord.js");

exports.run = async(client, message, args) => {  
  try {
    let member = await message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let invites = await message.guild.fetchInvites()
    let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id);
    if (memberInvites.size <= 0) {
        return message.channel.send(`**${member.displayName} didn't invite anyone to the server!**`, (member === message.member ? null : member));
    }

    let content = memberInvites.map(i => i.code).join("\n");
    let index = 0;
    memberInvites.forEach(invite => index += invite.uses);

    let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setFooter(client.user.username)
        .setThumbnail(message.guild.iconURL)
        .setAuthor(`Invite Tracker for ${message.guild.name}`, message.guild.iconURL)
        .setDescription(`Information on Invites of ${member.displayName}`)
        .addField("**No. Invited Persons**", index)
        .addField("Invitation Codes", content);
    message.channel.send(embed);
    } catch (e) {
      console.log(e.message);
      return message.channel.send(e.message)
    } 
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["inv"],
    permLevel: 0
};
  
exports.help = {
    name: 'invites',
    description: "Shows Users Joined Through Someone's Invites",
    usage: "[name | nickname | mention | ID] (optional)",
};