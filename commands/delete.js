const ms = require('ms');

exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id === "482706815784714272") {
    return message.channel.send(':x: You need to have the manage messages permissions to delete giveaways!');
  }

  let messageID = args[0];
  if (!messageID) {
    return message.channel.send(':x: You have to specify a valid message ID!');
  }

  client.giveawaysManager.delete(messageID).then(() => {
    return message.channel.send("Giveaway successfully deleted");
  }).catch(() => {
    return message.channel.send("No giveaway found with message ID " + `\`${messageID}\``)
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'delete',
  description: 'Remove giveaways using message id',
  usage: 'delete [message id]'
};