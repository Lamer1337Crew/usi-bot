const fs = require("fs");
const Discord = require("discord.js");
const settings = require("../settings.json");

exports.run = async (client, message, args, member ) => {
  if (!message.member.hasPermission("MANAGE_CHANNELS") &&
    message.author.id === '482706815784714272')
    return message.reply("Maaf anda tidak bisa menggunakan perintah ini!");
  
  if (!args.length) {
    return message.channel.send({embed: new Discord.RichEmbed()
                                       .setColor("RANDOM")
                                       .setTimestamp()
                                       .setThumbnail(client.user.avatarURL)
                                       .setAuthor("Setup Goodbye Image", client.user.avatarURL)
                                       .addField('Setting channel', `\`goodbye set [#mentions channel]\` \n\`Contoh: goodbye set #goodbye\``)
                                       .addField('Status On/Off', `\`goodbye on|off\` \n\`Contoh: goodbye on|off\``)
                                       .addField('Setting Background', `\`goodbye bg [upload|send link]\` \n\`Contoh: goodbye bg https://gambarpemandangan/09392920239929.com\``)
                                       .addField('Goodbye Image Testing', `\`goodbye-test\``)
                                       .setFooter("Unity State Indonesia", client.user.avatarURL)
                                      });
  };
  
  let m = args.join(" ");
  if (!m) {
     } else {
    if (m.match("set")) {
      let r = JSON.parse(fs.readFileSync("./data/goodbye.json", "utf8"));

      let ro = message.mentions.channels.first();
      if (!ro) return message.channel.send(`**Tolong Mentions Channels nya**`);
      if (ro) {
        r[message.guild.id] = {
          role: ro.id
        };
        fs.writeFile(
          "./data/goodbye.json",
          JSON.stringify(r, null, 2),
          err => {
            if (err) console.log(err);
          }
        );
        console.log(r);

        let dis = new Discord.RichEmbed()
          .setDescription(`✅ | Goodbye Di Set Ke ${ro}`)
          .setColor("RANDOM");
        message.channel.send(dis);
      }
    }
  }
  
  if (m.match("on")) {
    let log = JSON.parse(fs.readFileSync("./data/goodbyeset.json", "utf8"));
    log[message.guild.id] = {
      checker: 1
    };
    console.log(log);
    fs.writeFile(
      "./data/goodbyeset.json",
      JSON.stringify(log, null, 2),
      err => {
        if (err) console.log(err);
      }
    );
    let ms = new Discord.RichEmbed()
      .setDescription(`✅ | Goodbye sudah di aktifkan`)
      .setColor(`RANDOM`);
    message.channel.send(ms);
  }
  
  if (m.match("off")) {
    let log = JSON.parse(fs.readFileSync("./data/goodbyeset.json", "utf8"));
    log[message.guild.id] = {
      checker: 0
    };
    console.log(log);
    fs.writeFile(
      "./data/goodbye.json",
      JSON.stringify(log, null, 2),
      err => {
        if (err) console.log(err);
      }
    );
    let m = new Discord.RichEmbed()
      .setDescription(`❌ | Goodbye sudah non aktifkan`)
      .setColor("RANDOM");
    message.channel.send(m);
  }
  
  if (m.match("bg")) {
    let backgroundset = JSON.parse(
      fs.readFileSync("./data/backgroundgoodbye.json")
    );
    let setback = "";

    if ((setback = message.attachments.first())) {
      setback = message.attachments.first().url;
    } else {
      setback = args[1];
    }

    if (!setback)
      return message.reply("Tolong **UNGGAH** atau masukkan **LINK** gambar nya dulu ya");
    backgroundset[message.guild.id] = {
      backgrounds: setback
    };

    console.log(backgroundset);
    fs.writeFile("./data/backgroundgoodbye.json",JSON.stringify(backgroundset, null, 2), err => {
        if (err) console.log(err);
      });
    message.channel.send("✅ | Background sudah saya ganti");
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "goodbye",
  usage: "goodbye"
};