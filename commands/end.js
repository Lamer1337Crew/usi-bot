const ms = require('ms');

exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id === "482706815784714272") {
    return message.channel.send(':x: You need to have the manage messages permissions to ended giveaways!');
  }

  let messageID = args[0];
  if (!messageID) {
    return message.channel.send(':x: You have to specify a valid message ID!');
  }

  try {
    client.giveawaysManager.edit(messageID, {
      setEndTimestamp: Date.now()
    });
    message.channel.send('Giveaway will end in less than ' + (client.giveawaysManager.options.updateCountdownEvery / 1000) + ' seconds...');
  } catch (error) {
    if (error.startsWith(`No giveaway found with ID ${messageID}.`)) {
      message.channel.send('Cannot find any giveaway for the message ID: ' + messageID);
    }
    if (error.startsWith(`Giveaway with message ID ${messageID} is already ended.`)) {
      message.channel.send('This giveaway is already ended!');
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
  name: 'end',
  description: 'End giveaways using message id',
  usage: 'end [message id]'
};