const config = require("../settings.json");
const ms = require('ms');

exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id === "482706815784714272") {
    return message.channel.send(':x: You need to have the manage messages permissions to start giveaways!');
  }

  const currentGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
  if (currentGiveaways > 3) {
    return message.channel.send(":x: There can only be 4 simultaneous giveaways!");
  }

  let giveawayChannel = message.mentions.channels.first();
  if (!giveawayChannel) {
    return message.channel.send(':x: You have to mention a valid channel!');
  }

  let giveawayDuration = args[1];
  if (!giveawayDuration) {
    return message.channel.send(':x: You must enter the information like this: \n\n`//start [#mention channel] [time] [winners count] [prize]`');
  }

  if (isNaN(ms(giveawayDuration))) {
    return message.channel.send(":x: You must enter a valid time! Available units: `s`, `m`, `h` or `d`");
  }

  if (ms(giveawayDuration) > ms("1d")) {
    return message.channel.send(":x: The maximum duration of a giveaway is 1 days!");
  }

  let giveawayNumberWinners = args[2];
  if (!giveawayNumberWinners) {
    return message.channel.send(':x: You must enter the information like this: \n\n`//start [#mention channel] [time] [winners count] [prize]`');
  }

  if (isNaN(giveawayNumberWinners) || giveawayNumberWinners > 10 || giveawayNumberWinners < 1) {
    return message.channel.send(":x: Please specify a valid number between **1** and **10**!")
  }

  let giveawayPrize = args.slice(3).join(' ');
  if (!giveawayPrize) {
    return message.channel.send(':x: You must enter the information like this: \n\n`//start [#mention channel] [time] [winners count] [prize]`');
  }

  client.giveawaysManager.start(giveawayChannel, {
    time: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: parseInt(giveawayNumberWinners, 10),
    hostedBy: config.hostedBy ? message.author : null,
    messages: {
      giveaway: (config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY** 🎉🎉",
      giveawayEnded: (config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: "React with 🎉 to participate!",
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
      embedColor: "RANDOM",
      embedColorEnd: "RANDOM",
      embedFooter: "Giveaways",
      noWinner: "Giveaway cancelled, no valid participations!",
      hostedBy: "Hosted by: {user}",
      winners: "winner(s)",
      endedAt: "Ended at",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false
      }
    }
  });

  message.channel.send(`Giveaway started in ${giveawayChannel}!`);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'start',
  description: 'Start a giveaways for everyone',
  usage: 'start [#mentions channels] [time] [winners count] [prize]'
};