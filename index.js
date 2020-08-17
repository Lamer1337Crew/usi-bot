const { get } = require("node-superfetch");
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
 console.log('Pinging');
 response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require("discord.js");
const superagent = require("superagent");
const request = require("request");
const { registerFont } = require("canvas");
const { Canvas } = require("canvas-constructor");
const sql = require("sqlite");
const fetch = require("node-superfetch");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const settings = require("./settings.json");
const guildInvites = new Map();
const chalk = require("chalk");
const fs = require("fs");
const ms = require("ms");
const timezone = require("moment-timezone");
const moment = require("moment");
require("./util/eventLoader")(client);

//loading messages
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const cooldowns = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Command Loaded! ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.on("ready", async() => {
  setInterval(() => {
    const guilds = client.guilds.get(settings.serverid);
    const akun = guilds.memberCount
    const status = [
      `🌏 On In ${client.guilds.size} Server`,
      `✨ Happy For ${akun} Users`,
      `🛡️ Owned By ${guilds.name}`,
      `👬 #StayAtHome | #StayHealtly`,
      `📖 //help || All My Commands`
    ];
    let random = Math.floor(Math.random() * status.length);
    client.user.setPresence({
      game: {
        name: status[random],
        type: "playing",
        url: "https://www.twitch.tv/twitch"
      }
    });
  }, 20000);
});
  
//command reload
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

// Iseng wkwkwkwk
/*client.on("message", async(message) => {
    if (message.author.bot) return;
    if (!message.member.hasPermissions("SEND_MESSAGES")) return;
    if((/[a-z]/g).exec(message.content.toLowerCase())) {
      message.delete();
   }
});

// Anti pings
client.on("message", async(message) => {
   if (message.author.bot) return;
   if (message.mentions.everyone == true) {
   if (message.member.hasPermission("KICK_MEMBERS") &&
    message.author.id === '659315868098101249') return;
    return message.delete();
   }
});*/

// Anti Link
client.on("message", async(message) => {
  if (message.author.bot) return;
  if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
  if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;
  if (!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
  if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
  if (!message.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;
  const invitecheck = ["discord.gg", "discord.me", "discord.io/", "discordapp.com/invite"]
  if (invitecheck.some(word => message.content.toLowerCase().includes(word))) {
  if (message.member.hasPermission("ADMINISTRATOR")) return;
  if (message.member.hasPermission("MANAGE_MESSAGES")) return;
  message.delete();
  const date = Date.now();
  let modlog = message.guild.channels.find(channel => channel.name == "【🛰】ᴡᴀʀɴ-ʟᴏɢs");
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setThumbnail(client.user.avatarURL)
    .setAuthor("Anti Link Protection", client.user.avatarURL)
    .addField("Moderator", `${client.user.username}`, true)
    .addField("User", `${message.author.username}`, true)
    .addField("From channel", `${message.channel.name}`, true)
    .addField("Time took to delete", ms(Date.now() - date))
    .addField("Reason", "Contains Invites", true)
    .addField("Message", message.content, true)
  if(!modlog) return
  client.channels.get(modlog.id).send({embed});
        const reply = new Discord.RichEmbed()
               .setColor("RANDOM")
               .setTitle("⚠️ Warning !!!")
               .setDescription(`${message.author} **Maaf Anda Dilarang Memposting Link Invite Di Server Ini!**`)
               .setTimestamp()
        message.channel.send({embed: reply});
    };
});

// Anti spam
const usersMap = new Map();
const LIMIT = 5;
const TIME = 60000;
const DIFF = 3000;

client.on('message', message => {
  if(message.author.bot) return;
  if(usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    console.log(difference);
    if(difference > DIFF) {
      clearTimeout(timer);
      console.log('Cleared timeout');
      userData.msgCount = 1;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
        console.log('Removed from RESET.');
      }, TIME);
      usersMap.set(message.author.id, userData);
    }
    else {
      msgCount++;
      if(parseInt(msgCount) === LIMIT) {
        const role = message.guild.roles.get(settings.rolemuted);
        message.member.addRole(role);
        message.reply('You have been muted!');
        setTimeout(() => {
          message.member.removeRole(role);
          message.reply('You have been unmuted!');
        }, TIME);
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  }
  else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
      console.log('Removed from map.');
    }, TIME);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn
    });
  }
});

// Starboard
client.on("messageReactionAdd", async(reaction, user) => {
    if (user.bot) return;
    const handleStarboard = async () => {
        const starboard = client.channels.find(channel => channel.name.toLowerCase() === '【🛰】sᴛᴀʀs-ʟᴏɢs');
        const msgs = await starboard.fetchMessages({ limit: 100 });
        const existingMsg = msgs.find(msg => 
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if (existingMsg) existingMsg.edit(`${reaction.count} - 🌟 | ${reaction.message.channel}`);
        else {
            const date = Date.now();
            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor(`${reaction.message.author.tag}`, reaction.message.author.avatarURL)
                .addField('Url', `${reaction.message.url}`)
                .setDescription(`${reaction.message.content}`)
                .setFooter(`${reaction.message.id} - ${ms(Date.now() - date)}`)
                .setTimestamp();
            if (starboard)
                starboard.send(`1 - 🌟 | ${reaction.message.channel}`, embed);
        }
    }
    if (reaction.emoji.name === '🌟') {
        if (reaction.message.channel.name.toLowerCase() === '【🛰】sᴛᴀʀs-ʟᴏɢs') return;
        if (reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
            handleStarboard();
    }
});

client.on("messageReactionRemove", async(reaction, user) => {
    if (user.bot) return;
    const handleStarboard = async () => {
        const starboard = client.channels.find(channel => channel.name.toLowerCase() === '【🛰】sᴛᴀʀs-ʟᴏɢs');
        const msgs = await starboard.fetchMessages({ limit: 100 });
        const existingMsg = msgs.find(msg => 
            msg.embeds.length === 1 ? 
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if (existingMsg) {
            if (reaction.count === 0)
                existingMsg.delete({ timeout: 2500 });
            else
                existingMsg.edit(`${reaction.count} - 🌟 | ${reaction.message.channel}`)
        };
    }
    if (reaction.emoji.name === '🌟') {
        if (reaction.message.channel.name.toLowerCase() === '【🛰】sᴛᴀʀs-ʟᴏɢs') return;
        if (reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
            handleStarboard();
    }
});

// Invite tracker
client.on('inviteCreate', async invite => {
  guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
});

client.on('ready', () => {
    client.guilds.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(console.error);
    });
});

client.on('guildMemberAdd', async member => {
    if (member.bot) return;
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(client.user.avatarURL)
            .setTitle(`${member.guild.name}`)
            .setDescription(`${member.user.tag} users have joined the server`)
            .addField("Current Number Of Members", `${member.guild.memberCount} Member`)
            .addField("Invited By", `${usedInvite.inviter.tag}`)
            .addField("Number Of Used", `${usedInvite.uses}`)
            .addField("The link used", `${usedInvite.url}`)
            .setTimestamp();
        const channel = member.guild.channels.find(ch => ch.name === '【🛰】ɪɴᴠɪᴛᴇ-ʟᴏɢs');
        if (!channel) return;
        channel.send(embed).catch(console.error);
    } catch (err) {
      console.log(err.message);
    }
});

// welcome img
client.on("message", message => {
  if (message.content === "//welcome-test") {
    client.emit("guildMemberAdd", message.member);
  }
});

client.on("guildMemberAdd", async member => {
  let welcome = JSON.parse(fs.readFileSync("./data/welcome.json", "utf8"));
  let welcomeset = JSON.parse(fs.readFileSync("./data/welcomeset.json", "utf8"));
  if (!welcomeset[member.guild.id]) {
    welcomeset[member.guild.id] = {
      checker: 0
    };
  }
  let value = welcomeset[member.guild.id].checker;
  if (value === undefined) return;
  if (value === 0) return;
  if (value === 1) {
    let channelid = welcome[member.guild.id].role;
    const channel = member.guild.channels.find(ch => ch.id === channelid);
    if (!channel) return;

    //SET BACKGROUND
    let defaultback = "https://cdn.discordapp.com/attachments/727076581075451954/727410213505990656/welcome.jpg";
    let background = JSON.parse(fs.readFileSync("./data/backgroundwelcome.json", "utf8"));

    if (!background[member.guild.id]) {
      background[member.guild.id] = {
        backgrounds: defaultback
      };
    }
    let backimg = background[member.guild.id].backgrounds;

    let nameLimit = member.user.username;
    let username = nameLimit.length > 10 ? nameLimit.substring(0, 8) + "" : nameLimit;
    async function createCanvas() {
      let { body: background } = await superagent.get(backimg);
      let { body : avatar } = await superagent.get(member.user.displayAvatarURL);

      return new Canvas(1280, 800) //(1024, 450)
        .addImage(background, 0, 0, 1280, 800) // BACKGROUND
        .setShadowColor("rgba(22, 22, 22, 1)")
        .setShadowOffsetY(5)
        .setShadowBlur(10)
        .setColor(`yellow`)
        .addCircle(360, 365, 160)
        .addCircularImage(avatar, 360, 365, 155) // PROFILE

        .setTextFont("bold 60px sans-serif")
        .setTextAlign("center")
        .addText(`${username}#${member.user.discriminator}`, 860, 435) //385)

        .setTextFont("bold 75px sans-serif")
        .setTextAlign("center")
        .addText("WELCOME", 860, 285) //345)

        .setTextFont("bold 60px sans-serif")
        .setTextAlign("center")
        .addText(`#${member.guild.memberCount}`, 120, 125) //345)
        .toBufferAsync();
    }
    let Channel = member.guild.channels.get("channelid");
    if (!channel) return;
    channel.send(`Selamat Datang ${member} Di Server **${member.guild.name}** 👋 
Jangan Lupa Untuk Membaca :
- <#719238251352948776>
- <#719238520526471223>
- <#719251680646135830>

Apabila Sudah Membaca Silahkan Request Role Di :
- <#734699024937910293>

Semoga Betah Dan Patuhi Peraturan.🎉🤗`, {
        files: [{
            attachment: await createCanvas(),
            name: "welcome.png"
          }]
      });
    }
});

// Goodbye img
client.on("message", message => {
  if (message.content === "//goodbye-test") {
    client.emit("guildMemberRemove", message.member);
  }
});

client.on("guildMemberRemove", async member => {
  let goodbye = JSON.parse(fs.readFileSync("./data/goodbye.json", "utf8"));
  let goodbyeset = JSON.parse(fs.readFileSync("./data/goodbyeset.json", "utf8"));
  if (!goodbyeset[member.guild.id]) {
    goodbyeset[member.guild.id] = {
      checker: 0
    };
  }
  let value = goodbyeset[member.guild.id].checker;
  if (value === undefined) return;
  if (value === 0) return;
  if (value === 1) {
    let channelid = goodbye[member.guild.id].role;
    const channel = member.guild.channels.find(ch => ch.id === channelid);
    if (!channel) return;

    //SET BACKGROUND
    let defaultback = "https://cdn.discordapp.com/attachments/727076581075451954/727434781872095322/goodbye.jpg";
    let background = JSON.parse(fs.readFileSync("./data/backgroundgoodbye.json", "utf8"));

    if (!background[member.guild.id]) {
      background[member.guild.id] = {
        backgrounds: defaultback
      };
    }
    let backimg = background[member.guild.id].backgrounds;

    let nameLimit = member.user.username;
    let username = nameLimit.length > 10 ? nameLimit.substring(0, 8) + "" : nameLimit;
    async function createCanvas() {
      let { body: background } = await superagent.get(backimg); //("https://cdn.discordapp.com/attachments/596041860711972864/665779128598790144/images_22.jpeg");
      let { body : avatar } = await superagent.get(member.user.displayAvatarURL);
      
      return new Canvas(1280, 800) //(1024, 450)
        .addImage(background, 0, 0, 1280, 800) // BACKGROUND
        .setShadowColor("rgba(22, 22, 22, 1)")
        .setShadowOffsetY(5)
        .setShadowBlur(10)
        .setColor(`yellow`)
        .addCircle(360, 365, 160)
        .addCircularImage(avatar, 360, 365, 155) // PROFILE

        .setTextFont("bold 60px sans-serif")
        .setTextAlign("center")
        .addText(`${username}#${member.user.discriminator}`, 860, 435) //385)

        .setTextFont("bold 75px sans-serif")
        .setTextAlign("center")
        .addText("GOODBYE", 860, 285) //345)

        .setTextFont("bold 60px sans-serif")
        .setTextAlign("center")
        .addText(`#${member.guild.memberCount}`, 120, 125) //345)
        .toBufferAsync();
    }
    let Channel = member.guild.channels.get("channelid");
    if (!channel) return;
    channel.send(`Selamat Tinggal Sobat **${member.user.tag}** Terima Kasih Sudah Mampir Ke Sini 👋`, {
        files: [{
            attachment: await createCanvas(),
            name: "goodbye.png"
          }]
      });
    }
});

// Member Count
client.on("guildMemberAdd", member => {
  let guild = client.guilds.get(settings.serverid);
  let akun = guild.memberCount;
  let total = member.guild.channels.get(settings.total);
  let totalbot = member.guild.channels.get(settings.totalbot);
  let user = member.guild.channels.get(settings.user);
  let role = guild.channels.get(settings.role);
  let channel = guild.channels.get(settings.channel);
  
  total.setName(`【👥】Members: ${akun}﹢°☼`);
  totalbot.setName(`【🤖】Bots: ${guild.members.filter(n => n.user.bot).size}`);
  user.setName(`【👤】Humans: ${guild.members.filter(x => !x.user.bot).size}`);
  role.setName(`【🎯】Roles: ${guild.roles.size}`);
  channel.setName(`【🔰】Channels: ${guild.channels.size}﹢`);
});

client.on("guildMemberRemove", member => {
  let guild = client.guilds.get(settings.serverid);
  let akun = guild.memberCount;
  let total = member.guild.channels.get(settings.total);
  let totalbot = member.guild.channels.get(settings.totalbot);
  let user = member.guild.channels.get(settings.user);
  let roles = member.guild.channels.get(settings.role);
  let channel = member.guild.channels.get(settings.channel);
  
  total.setName(`【👥】Members: ${akun}﹢°☼`);
  totalbot.setName(`【🤖】Bots: ${guild.members.filter(n => n.user.bot).size}`);
  user.setName(`【👤】Humans: ${guild.members.filter(x => !x.user.bot).size}`);
  roles.setName(`【🎯】Roles: ${guild.roles.size}`);
  channel.setName(`【🔰】Channels: ${guild.channels.size}`);
});

// Join to create
client.on("voiceStateUpdate", async(oldMember, newMember) => {
  let category = "719241047233789983";
  let voice = "737835088548593808";

  if (newMember.voiceChannelID === voice) {
    newMember.guild.createChannel("【🎙️】New Room", "voice")
      .then(tempChannel => {
        tempChannel.setParent(category);
        newMember.setVoiceChannel(tempChannel.id);
        tempChannel.setUserLimit("50");
      })
      .catch(console.error);
  }

  if (oldMember.voiceChannelID) {
    let voiceLama = oldMember.guild.channels.get(oldMember.voiceChannelID);
    if (voiceLama.name.startsWith("【🎙️】New Room")) {
      voiceLama.delete()
        .then(function() {
          console.log("Voice lama sudah di hapus");
        })
        .catch(console.error);
    }
  }
});

// Mention sibuk
client.on("message", async(simi) => {
if(simi.author.bot) return;
const pokeself = [
        `Dibilangin ngeyel lu ${simi.author} jangan di tag dia lagi sibuk!`,
        `${simi.author} Jangan di tag mulu woyy asu!`,
        `Woyy ${simi.author} sekali lu lagi tag bos gua, gua tabok lu bngst !!!`  
    ]
let result = Math.floor(Math.random() * pokeself.length);
var owner = `<@482706815784714272>`;
if(simi.content.toLowerCase().includes(owner)) {
if(simi.member.hasPermission("MANAGE_MESSAGES")) return;
         simi.delete();
         //simi.channel.send(`**${pokeself[result]}**`);
   }
});

client.elevation = message => {
  if (message.channel.type === 'dm') return;
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("MANAGE_GUILD")) permlvl = 3;
  if (message.member.id === message.guild.ownerID) permlvl = 4;
  if (message.author.id === settings.ownerid) permlvl = 5;
  return permlvl;
};

// Cukup ini aja yg di copy trus paste
const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./data/giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColor: "RANDOM",
    embedColorEnd: "RANDOM",
    reaction: "🎉" //(ganti pake emoji yg namanya :tada:)
  }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});
// sampe kesini

    
client.login(process.env.BOT_TOKEN);