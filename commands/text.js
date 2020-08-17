const Discord = require("discord.js");

exports.run = async(client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id !== "482706815784714272")
     return message.reply("**Anda memerlukan izin \`MANAGE_GUILD\` untuk menggunakan perintah ini!**");
  
  const channel = message.mentions.channels.first();
  if (!channel) return message.reply('Tolong mentions channel nya setelah itu masukan kalimat/kata/text!');
  
  const text = args.slice(1).join(" ");
		if (!text) {
			return message.reply ("Anda harus memasukkan teks announcement!");
		}
  
		if (text.length > 1030) {
			return message.reply("Silakan masukkan teks yang lebih pendek dari 1030 karakter!");
		}

		message.delete();

		let mention = "";
            
		const msg = await message.channel.send("Apakah Anda ingin menambahkan menyebutkan ke pesan Anda? Jawab \`iya\` atau \`tidak\`");
		const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 240000 });
            
		collector.on("collect", async(tmsg) => {
    
			if (tmsg.content.toLowerCase() === "tidak") {
				tmsg.delete();
				msg.delete();
				collector.stop(true);
			} 
      
      if (tmsg.content.toLowerCase() === "iya") {
				tmsg.delete();
        
				const tmsg1 = await msg.edit("Ketik salah satu jawaban berikut: `every` (untuk menyebutkan @ everyone) atau `here` (untuk menyebutkan @ here)!");
				const c = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 60000 });
				c.on("collect", (m) => {
					if (m.content.toLowerCase() === "here") {
						mention = "@here";
						tmsg1.delete();
						m.delete();
						collector.stop(true);
						c.stop(true);
					} else if (m.content.toLowerCase() === "every") {
						mention = "@everyone";
						tmsg1.delete();
						m.delete();
						collector.stop(true);
						c.stop(true);
					}
				});
				c.on("end", (collected, reason) => {
					if (reason === "time") {
						return message.reply("Waktunya habis! Silakan kirim perintah lagi!");
					}
				});
			}
		});
    
		collector.on("end", (collected, reason) => {
    
			if (reason === "time") {
				return message.reply("Waktunya habis! Silakan kirim perintah lagi!");
			}

			const embed = new Discord.RichEmbed()
        .setThumbnail(client.user.avatarURL)
				.setAuthor("📢 Announcement")
				.setColor("RANDOM")
				.setFooter(client.user.username)
				.setTimestamp()
				.setDescription(text);
         
      message.channel.send(`Pesan anda sudah terkirim ke channel ${channel}`).then(x => x.delete(2500));
			client.channels.get(channel.id).send(mention, embed);
		});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "text",
    description: "Makes the bot repeat your message.",
    usage: "text [#channel] [message]"
};