const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE'] });

module.exports = async(oldMember, newMember) => {
  if (oldMember.user.bot) return;
  let guilds = oldMember.guild;

  let username = oldMember.displayName;
  let avatar = oldMember.user.displayAvatarURL;
  let lama = oldMember.voiceChannelID;
  let baru = newMember.voiceChannelID;

  let oldChannel = lama != null && lama != undefined ? guilds.channels.get(lama).name : null;
  let newChannel = baru != null && baru != undefined ? guilds.channels.get(baru).name : null;

  if (!oldMember.partial) {
    let modlog = guilds.channels.find("name", "【🛰】ʙᴏᴛ-ʟᴏɢs");
    if (modlog) {
      if (oldChannel === null) {
        let embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(avatar)
          .setAuthor("🔊 Voice Channel | Join")
          .setDescription(`\`\`\`${username} Masuk ke voice channel ${newChannel}\`\`\``, true);
        modlog.send({embed}).catch(console.error);
        console.log("MASUK");
      } else if (newChannel === null) {
        let embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(avatar)
          .setAuthor("🔊 Voice Channel | Leave")
          .setDescription(`\`\`\`${username} Keluar dari voice channel ${oldChannel}\`\`\``, true);
        modlog.send({embed}).catch(console.error);
        console.log("KELUAR");
      } else {
        let embed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(avatar)
          .setAuthor("🔊 Voice Channel | Move")
          .setDescription(`\`\`\`${username} Berpindah dari voice channel ${oldChannel} ke voice channel ${newChannel}\`\`\``, true);
        modlog.send({embed}).catch(console.error);
        console.log("PINDAH");
      }
    }
  }
};