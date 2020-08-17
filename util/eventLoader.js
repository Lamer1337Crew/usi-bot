const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('reconnecting', () => reqEvent('reconnecting')(client));
  client.on('disconnect', () => reqEvent('disconnect')(client));
  client.on('message', reqEvent('message'));
  client.on('messageDelete', reqEvent('messageDelete'));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  client.on('guildMemberUpdate', reqEvent('guildMemberUpdate'));
  client.on('channelCreate', reqEvent('channelCreate'));
  client.on('channelDelete', reqEvent('channelDelete'));
  client.on('voiceStateUpdate', reqEvent('voiceStateUpdate'));
};