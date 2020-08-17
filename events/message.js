const Discord = require("discord.js");
const config = require("../settings.json");
const fs = require("fs");
const db = require("quick.db");
const superagent = require("superagent");
module.exports = async message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;

  let cd = new Set();
  let cdseconds = 5;

  let prefix = config.prefix;
  let client = message.client;

  if (
    message.content.startsWith(`<@${client.user.id}>`) ||
    message.content.startsWith(`<@!${client.user.id}>`)
  ) {
    if (message.content.toLowerCase().includes("prefix"))
      return message.reply(
        `My current prefix is \`${config.prefix}\` type \`${config.prefix}help\` jump to list all my commands`
      );
    if (config.chatbot == true) {
      message.channel.startTyping();
      let string = message.content
        .split(" ")
        .slice(1)
        .join("%20");
      const { body } = await superagent
        .get(`https://some-random-api.ml/chatbot?message=${string}`)
        .catch(e => {
          if (e) {
            message.channel.stopTyping();
            return message.channel.send(
              `The API made a fucky wucky and broke! \n\`${e}\``
            );
          }
        });
      message.reply(body.response).then(message => {
        message.channel.stopTyping();
        return;
      });
    }
  }

  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0].slice(prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) {
      db.add(`guildMessages_${message.guild.id}`, 1);
      console.log(
        "Command: //" +
          cmd.help.name +
          " - Guild: " +
          message.guild.name +
          " ID: " +
          message.guild.id
      );
      return;
    }
    cmd.run(client, message, params, perms);
    console.log(
      "Command: //" +
        cmd.help.name +
        " - Guild: " +
        message.guild.name +
        " ID: " +
        message.guild.id
    );

    db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
    let messagefetch = db.fetch(
      `messages_${message.guild.id}_${message.author.id}`
    );

    let messages;
    if (messagefetch == 0) messages = 0;
    //Level 0
    else if (messagefetch == 100) messages = 100;
    // Level 1
    else if (messagefetch == 200) messages = 200;
    // Level 2
    else if (messagefetch == 300) messages = 300;
    // Level 3
    else if (messagefetch == 400) messages = 400;
    // Level 4
    else if (messagefetch == 500) messages = 500;
    // Level 5
    else if (messagefetch == 600) messages = 600;
    // Level 6
    else if (messagefetch == 700) messages = 700;
    // Level 7
    else if (messagefetch == 800) messages = 800;
    // Level 8
    else if (messagefetch == 900) messages = 900;
    // Level 9
    else if (messagefetch == 1000) messages = 1000;
    // Level 10
    else if (messagefetch == 1100) messages = 1100;
    // Level 11
    else if (messagefetch == 1200) messages = 1200;
    // Level 12
    else if (messagefetch == 1300) messages = 1300;
    // Level 13
    else if (messagefetch == 1400) messages = 1400;
    // Level 14
    else if (messagefetch == 1500) messages = 1500;
    // Level 15
    else if (messagefetch == 1600) messages = 1600;
    // Level 16
    else if (messagefetch == 1700) messages = 1700;
    // Level 17
    else if (messagefetch == 1800) messages = 1800;
    // Level 18
    else if (messagefetch == 1900) messages = 1900;
    // Level 19
    else if (messagefetch == 2000) messages = 2000;
    // Level 20
    else if (messagefetch == 2100) messages = 2100;
    // Level 21
    else if (messagefetch == 2200) messages = 2200;
    // Level 22
    else if (messagefetch == 2300) messages = 2300;
    // Level 23
    else if (messagefetch == 2400) messages = 2400;
    // Level 24
    else if (messagefetch == 2500) messages = 2500;
    // Level 25
    else if (messagefetch == 2600) messages = 2600;
    // Level 26
    else if (messagefetch == 2700) messages = 2700;
    // Level 27
    else if (messagefetch == 2800) messages = 2800;
    // Level 28
    else if (messagefetch == 2900) messages = 2900;
    // Level 29
    else if (messagefetch == 3000) messages = 3000;
    // Level 30
    else if (messagefetch == 3100) messages = 3100;
    // Level 31
    else if (messagefetch == 3200) messages = 3200;
    // Level 32
    else if (messagefetch == 3300) messages = 3300;
    // Level 33
    else if (messagefetch == 3400) messages = 3400;
    // Level 34
    else if (messagefetch == 3500) messages = 3500;
    // Level 35
    else if (messagefetch == 3600) messages = 3600;
    // Level 36
    else if (messagefetch == 3700) messages = 3700;
    // Level 37
    else if (messagefetch == 3800) messages = 3800;
    // Level 38
    else if (messagefetch == 3900) messages = 3900;
    // Level 39
    else if (messagefetch == 4000) messages = 4000;
    // Level 40
    else if (messagefetch == 4100) messages = 4100;
    // Level 41
    else if (messagefetch == 4200) messages = 4200;
    // Level 42
    else if (messagefetch == 4300) messages = 4300;
    // Level 43
    else if (messagefetch == 4400) messages = 4400;
    // Level 44
    else if (messagefetch == 4500) messages = 4500;
    // Level 45
    else if (messagefetch == 4600) messages = 4600;
    // Level 46
    else if (messagefetch == 4700) messages = 4700;
    // Level 47
    else if (messagefetch == 4800) messages = 4800;
    // Level 48
    else if (messagefetch == 4900) messages = 4900;
    // Level 49
    else if (messagefetch == 5000) messages = 5000; // level 50

    if (!isNaN(messages)) {
      db.add(`level_${message.guild.id}_${message.author.id}`, 1);
      let levelfetch = db.fetch(
        `level_${message.guild.id}_${message.author.id}`
      );

      let levelembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(
          `${message.author.toString()}, You have leveled up to level ${levelfetch}`
        );
      return message.channel.send(levelembed).then(m => m.delete(5000));
    }
    if (message.author.id !== config.ownerid) {
      if (cd.has(message.author.id)) {
        message.delete();
        return message.reply("This command is for cd for 5 sec");
      }
      cd.add(message.author.id);
    }
  }

  setTimeout(() => {
    cd.delete(message.author.id);
  }, cdseconds * 5000);
};
