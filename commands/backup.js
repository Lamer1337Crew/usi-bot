const { RichEmbed, Client, Util, Message } = require("discord.js");
const fs = require("fs");
const hastebins = require("hastebin-gen");

var backups = JSON.parse(fs.readFileSync("./data/backups.json", "utf8"));

exports.run = async(client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id === "482706815784714272") {
    return message.reply("You don't have the **Manage Guild** permission!");
  };

  try {
      let info = client.emojis.get("655091815401127966") || "ℹ️"; 
      let waiting = client.emojis.get("655695570769412096") || "⌛"; 
      let green = client.emojis.get("655696285286006784") || "✅"; 
      let error = client.emojis.get("655704809483141141") || "❌"; 
      let warning = client.emojis.get("656030540310380574") || "⚠️"; 

      let guildsonlyEmbed = new RichEmbed()
        .setTitle(`${error} Error`)
        .setDescription(`This command **can't be used** in **DMs**`)
        .setColor("RANDOM");

      let usersonlyEmbed = new RichEmbed()
        .setTitle(`${error} Error`)
        .setDescription(`This command **can't be used** by a **Bot**`)
        .setColor("RANDOM");

      if (message.channel.type === "dm")
        return message.channel.send(guildsonlyEmbed);
      if (message.author.bot) return message.channel.send(usersonlyEmbed);
      
      if (args[0] === "create" || args[0] === "c") {
        await message.guild.roles
          .filter(r => 
                  r.name !== message.guild.member(client.user.id).highestRole.name
          )
          .forEach(r => {
            if (r.comparePositionTo(message.guild.member(client.user.id).highestRole) > 0) {
              let havnthighest = new RichEmbed()
                .setTitle(`${warning}  Warning`)
                .setDescription(`The Bot Role Is Not The Highest Role In The Server , This May Cause Some Errors When Loading The Backup. !`)
                .setColor("RANDOM");
              return message.channel.send(havnthighest);
            }
          });

        let creatingEmbed = new RichEmbed()
          .setColor("RANDOM")
          .setTitle(`${waiting}  Please wait ...`)
          .setDescription("Creating backup ... Please wait");
        message.channel.send(creatingEmbed).then(m => {
          let id = makeid(16);

          const channels = message.guild.channels
            .sort(function(a, b) {
              return a.position - b.position;
            })
            .array()
            .map(c => {
              const channel = {
                type: c.type,
                name: c.name,
                postion: c.calculatedPosition
              };
              if (c.parent) channel.parent = c.parent.name;
              return channel;
            });

          const roles = message.guild.roles
            .filter(r => r.name !== "@everyone")
            .sort(function(a, b) {
              return a.position - b.position;
            })
            .array()
            .map(r => {
              const role = {
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions,
                mentionable: r.mentionable,
                position: r.position
              };
              return role;
            });

          if (!backups[message.author.id]) backups[message.author.id] = {};
          backups[message.author.id][id] = {
            icon: message.guild.iconURL,
            name: message.guild.name,
            owner: message.guild.ownerID,
            members: message.guild.memberCount,
            createdAt: message.guild.createdAt,
            roles: roles,
            channels: channels
          };

          save();
          let result = new RichEmbed()
            .setTitle(`${info}  Info`)
            .setDescription(`Created backup of **${message.guild.name}** with the Backup id \`${id}\``)
            .addField("Usage", `\`\`\`//backup load ${id}\`\`\`
\`\`\`//backup info ${id}\`\`\``
            )
            .setColor("RANDOM");

          message.author.send(result);

          let resultPublic = new RichEmbed()
            .setTitle(`${green}  Voila!`)
            .setDescription(`Created backup of **${message.guild.name}** with the Backup id \`${id}\``)
            .addField("Usage", `\`\`\`//backup load ${id}\`\`\`
\`\`\`//backup info ${id}\`\`\``
            )
            .setColor("RANDOM");

          m.edit(resultPublic);
        });
      }

      if (args[0] === "delete") {
        let code = args[1];
        let errorEmbed = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You forgot to define the argument backup_id. Use //help backup load for more information.`)
          .setColor("RANDOM");
        if (!code) return message.channel.send(errorEmbed);

        let cantfindbackup = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You have no backup with the id ${code}.`)
          .setColor("RANDOM");
        if (!backups[message.author.id][code])
          return message.channel.send(cantfindbackup);

        delete backups[message.author.id][code];
        save();

        let deletedsuc = new RichEmbed()
          .setTitle(`${green}  Voila!`)
          .setDescription(`Successfully **deleted backup**.`)
          .setColor("RANDOM");
        message.channel.send(deletedsuc);
      }

      if (args[0] === "load" || args[0] === "l") {
        let error = client.emojis.get("655704809483141141") || "❌";
        let code = args[1];
        let errorEmbed = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You forgot to define the argument backup_id. Use //help backup load for more information.`)
          .setColor("RANDOM");
        if (!code) return message.channel.send(errorEmbed);
        let cantfindbackup = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You have no backup with the id ${code}.`)
          .setColor("RANDOM");
        if (!backups[message.author.id][code])
          return message.channel.send(cantfindbackup);

        message.guild.channels.forEach(channel => {
          channel.delete("For Loading A Backup");
        });

        message.guild.roles
          .filter(role => role.members.every(member => !member.user.bot))
          .forEach(role => {
            role.delete("For Loading A Backup");
          });
        await backups[message.author.id][code].roles.forEach(async function(role) {
          message.guild
            .createRole({
              name: role.name,
              color: role.color,
              permissions: role.permissions,
              hoist: role.hoist,
              mentionable: role.mentionable,
              position: role.position
            })
            .then(role => {
              role.setPosition(role.position);
            });
        });

        await backups[message.author.id][code].channels
          .filter(c => c.type === "category")
          .forEach(async function(ch) {
            message.guild.createChannel(ch.name, {
              type: ch.type,
              permissionOverwrites: ch.permissionOverwrites
            });
          });

        await backups[message.author.id][code].channels
          .filter(c => c.type !== "category")
          .forEach(async function(ch) {
            message.guild.createChannel(ch.name, {
              type: ch.type,
              permissionOverwrites: ch.permissionOverwrites
            }).then(c => {
                const parent = message.guild.channels
                  .filter(c => c.type === "category")
                  .find(c => c.name === ch.parent);
                ch.parent ? c.setParent(parent) : "";
            });
          });
        message.guild.setName(backups[message.author.id][code].name);
        message.guild.setIcon(backups[message.author.id][code].icon);
      }
    
    if (args[0] === "info" || args[0] === "i") {
        let id = args[1];
        let MissingbackupinfoEmbed = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You forgot to define the argument **backup_id**. Use \`//help backup info\` for more information`)
          .setColor("RANDOM");
        if (!id) return message.channel.send(MissingbackupinfoEmbed);

        let cantfindEmbed = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You have **no backup** with the id \`${id}\`.`)
          .setColor("RANDOM");
        if (!backups[message.author.id][id])
          return message.channel.send(cantfindEmbed);

        try {
          let infoEmbed = new RichEmbed()
            .setColor("RANDOM")
            .setTitle(backups[message.author.id][id].name)
            .setThumbnail(backups[message.author.id][id].icon)
            .addField("Creator", `<@${backups[message.author.id][id].owner}>`, true)
            .addField("Members", backups[message.author.id][id].members, true)
            .addField("Created At", backups[message.author.id][id].createdAt, true)
            .addField("Channels", `\`\`\`${backups[message.author.id][id].channels.map(channel => channel.name).join("\n")}\`\`\``, true)
            .addField("Roles", `\`\`\`${backups[message.author.id][id].roles.map(role => role.name).join("\n")}\`\`\``, true);
          message.channel.send(infoEmbed);
        } catch (e) {
          hastebins(backups[message.author.id][id].channels.map(channel => channel.name).join("\n"), "txt")
            .then(ch => {
            hastebins(backups[message.author.id][id].roles.map(role => role.name).join("\n"), "txt")
              .then(ro => {
              let infoEmbed = new RichEmbed()
                .setColor("RANDOM")
                .setTitle(backups[message.author.id][id].name)
                .setThumbnail(backups[message.author.id][id].icon)
                .addField("Creator", `<@${backups[message.author.id][id].owner}>`, true)
                .addField("Members", backups[message.author.id][id].members, true)
                .addField("Created At",backups[message.author.id][id].createdAt, true)
                .addField("Channels", ch, true)
                .addField("Roles", ro, true);
              message.channel.send(infoEmbed);
            });
          });
        }
      }
    
    if (args[0] === "list") {
      let listEmbed = new RichEmbed()
        .setTitle(`${info} List of backup data server`)
        .setDescription(`Guild: \`${message.guild.name}\`\nData id: \`AiOrloNJR2GRfwdS\``)
        .setColor("RANDOM")
      message.channel.send(listEmbed);
    }
    
    if (args[0] === "purge") {
        let errorEmbed = new RichEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(`You did'nt backup any server yet`)
          .setColor("RANDOM");
        if (!backups[message.author.id])
          return message.channel.send(errorEmbed);

        let warningEmbed = new RichEmbed()
          .setTitle(`${warning}  Warning`)
          .setDescription(`Are you sure that you want to delete all your backups? __This cannot be undone!__`);
        message.channel.sendEmbed(warningEmbed).then(msg => {
          msg.react("✅").then(() => msg.react("❌"));

          let yesFilter = (reaction, user) =>
            reaction.emoji.name === "✅" && user.id === message.author.id;
          let noFilter = (reaction, user) =>
            reaction.emoji.name === "❌" && user.id === message.author.id;

          let yes = msg.createReactionCollector(yesFilter, { time: 0 });
          let no = msg.createReactionCollector(noFilter, { time: 0 });

          yes.on("collect", r => {
            delete backups[message.author.id];

            let deletedsuc = new RichEmbed()
              .setTitle(`${green}  Voila!`)
              .setDescription(`Deleted all your backups.`)
              .setColor("RANDOM");
            message.channel.send(deletedsuc);
            msg.delete();
          });

          no.on("collect", r => {
            msg.delete();
          });
        });
      }

      if (!args[0]) {
        const embed = new RichEmbed()
          .setTitle(
            `**backup**
Create & load backups of your servers
__**Commands**__
`
          )
          .setDescription(
            `
//backup create        Create a backup
//backup delete        Delete one of your backups
//backup info          Get information about a backup
//backup list          Get a list of your backups
//backup load          Load a backup
//backup purge         Delete all your backups
          `)
          .addBlankField()
          .setFooter(`Use \`//help [command]\` for more info on a command.`)
          .setColor("RANDOM");
        message.channel.send(embed);
        return;
      }

      function makeid(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

      function save() {
        fs.writeFile("./data/backups.json", JSON.stringify(backups), err => {
          if (err) console.error(err);
        });
      }
    } catch (e) {
      console.log(e);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "backup",
  description: "Membackup data server",
  usage: "backup"
};