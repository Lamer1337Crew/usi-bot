exports.run = async function(client, message, args) {
  
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("❌**Error:** You don't have the **Manage Messages** permission!");
  if(!args[0]) return message.reply('Usage: //purge all|bots|user|author <amount>')
  if(args[0] === 'all') {
    message.channel.send("All messages of the channel will be deleted! To confirm type `Ok`");
			await message.channel.awaitMessages((m) => (m.author.id === message.author.id) && (m.content === "Ok"), {
				max: 1,
				time: 20000,
				errors: ["time"]
			}).catch((err) => {
        console.log(err);
				return message.reply("Time's up! Please send the command again!");
			});
			const position = message.channel.position;
			const newChannel = await message.channel.clone();
			await message.channel.delete();
			newChannel.setPosition(position);
			return newChannel.send("All messages has been cleared!");
    
  } else if(args[0] === 'bots') {
    if(!args[1]) return message.channel.send("You need to specify an amount");
    if(isNaN(args[1])) return message.channel.send("You need to specify a valid amount");
    if(parseInt(args[1]) > 100) return message.channel.send("I can only delete max 100 messages at a time :wink:")

    message.channel.fetchMessages({
      limit: args[1]
    }).then(messages => {
      const userMessages = messages.filter(message => message.author.bot) 
      message.channel.bulkDelete(userMessages)
    }).catch(e => {
      if(e) return message.channel.send(`${e}`)
    });
    
  } else if(args[0] === 'user') {
    if(!args[1]) return message.channel.send("You need to specify an amount");
    if(isNaN(args[1])) return message.channel.send("You need to specify a valid amount");
    if(parseInt(args[1]) > 100) return message.channel.send("I can only delete max 100 messages at a time :wink:")

    message.channel.fetchMessages({
      limit: args[1]
    }).then(messages => {
      const userMessages = messages.filter(message => !message.author.bot) 
      message.channel.bulkDelete(userMessages)
    }).catch(e => {
      if(e) return message.channel.send(`${e}`)
    });
    
  } else if(args[0] === 'author'){
    if(!message.mentions || message.mentions.users.size < 1) return message.channel.send("Ping someone to delete their message!")
    if(!args[2]) return message.channel.send("You need to specify an amount");
    if(isNaN(args[2])) return message.channel.send("You need to specify a valid amount");
    if(parseInt(args[2]) > 100) return message.channel.send("I can only delete max 100 messages at a time :wink:")

    message.channel.fetchMessages({
      limit: parseInt(args[2])
    }).then(messages => {
      const userMessages = messages.filter(message => message.mentions.users.first() || message.author) 
      message.channel.bulkDelete(userMessages)
    }).catch(e => {
      if(e) return message.channel.send(`${e}`)
    });
    
  } else if(args[0] === 'image') {
    message.reply("Upcoming feature :wink:")
  } else {
    message.reply('Usage: //purge all|bots|user|author <amount>')
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'purge',
  description: 'Purges X amount of messages from a given channel.',
  usage: 'purge all|bots|user|author <amount>'
};