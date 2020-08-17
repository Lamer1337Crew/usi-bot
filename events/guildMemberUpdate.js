const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE'] });

module.exports = (oldMember, newMember) => {
  if (oldMember.user.bot) return;
  let guilds = oldMember.guild;

  if (!oldMember.partial) {
    const modlog = guilds.channels.find("name", "【🛰】ʙᴏᴛ-ʟᴏɢs");
    if (modlog) {
      if (oldMember.nickname !== newMember.nickname) {
        const embed = new Discord.RichEmbed()
          .setAuthor("👤 Pergantian Nickname")
          .setColor("RANDOM")
          .addField("**Users**", `<@${newMember.user.id}>`)
          .addField("**Before**", `${oldMember.nickname !== undefined ? `${oldMember.nickname}` : oldMember.nickname}`, true)
          .addField("**After**", `${newMember.nickname !== undefined ? `${newMember.nickname}` : newMember.nickName}`, true)
          .setThumbnail(`${oldMember.user.avatarURL}`)
          .setTimestamp();

        modlog.send({embed});
      }

      if (oldMember.user.name !== newMember.user.name) {
        const embed = new Discord.RichEmbed()
          .setAuthor("👤 Pergantian Username")
          .setColor("RANDOM")
          .addField("**Users", `<@${newMember.user.id}>`)
          .addField("**Before**", `${oldMember.username}`, true)
          .addField("**After**", `${newMember.username}`, true)
          .setThumbnail(`${oldMember.user.avatarURL}`)
          .setTimestamp();

        modlog.send({embed});
      }
      /* Role Given */
      if (oldMember.roles.size !== newMember.roles.size) {
        if (oldMember.roles.size < newMember.roles.size) {
          let diff = newMember.roles.filter(r => !oldMember.roles.has(r.id)).first();
          if (diff) {
            let embed = new Discord.RichEmbed()
              .setAuthor("👤 Member Roles Updated")
              .setColor("RANDOM")
              .addField("**Users**", `<@${newMember.user.id}>`, true)
              .addField("**Role Given**", `${diff}`, true)
              .setThumbnail(`${oldMember.user.avatarURL}`)
              .setTimestamp();

            modlog.send({embed});
          } /* Role Taken */
        } else if (oldMember.roles.size > newMember.roles.size) {
          let diff = oldMember.roles.filter(r => !newMember.roles.has(r.id)).first();
          if (diff) {
            let embed = new Discord.RichEmbed()
              .setAuthor("👤 Member Roles Updated")
              .setColor("RANDOM")
              .addField("**Users**", `<@${newMember.user.id}>`, true)
              .addField("**Role Taken**", `${diff}`, true)
              .setThumbnail(`${oldMember.user.avatarURL}`)
              .setTimestamp();

            modlog.send({embed});
          }
        }
      }
    }
  }
};