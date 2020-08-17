const ms = require('ms');

exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id === "482706815784714272") {
    return message.channel.send(':x: You need to have the manage messages permissions to reroll giveaways!');
  }

  let messageID = args[0];
  if (!messageID) {
    return message.channel.send(':x: You have to specify a valid message ID!');
  }

  try {
    client.giveawaysManager.reroll(messageID);
    message.channel.send('Giveaway re-rolled!');
  } catch (error) {
    if (error.startsWith(`No giveaway found with ID ${messageID}.`)) {
      message.channel.send('Cannot find any giveaway for the message ID: ' + messageID);
    }
    if (error.startsWith(`Giveaway with message ID ${messageID} is not ended.`)) {
      message.channel.send('This giveaway is not ended!');
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'reroll',
  description: 'Change the winners of giveaways using message id',
  usage: 'reroll [message id]'
};