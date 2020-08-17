const Discord = require("discord.js");

exports.run = async (client, message, args) => {

//----------------------EMBED------------------------
let embed1 = new Discord.RichEmbed()
.setDescription("😥 Silakan tentukan angka benar! 1-100")
.setColor('#0093f3')
//----------------------EMBED------------------------
let embed3 = new Discord.RichEmbed()
.setDescription('🤐 Tidak bisa tolol:v')

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(embed3);


  if(!args[0]) return message.channel.send(embed1);


  message.channel.bulkDelete(args[0]).then(() => {

let embed2 = new Discord.RichEmbed()
.setDescription(`${args[0]} Pesan telah Dibersihkan 🔥`)
.setColor('#f82b03')
//mengirim embed
message.channel.send(embed2).then(msg => msg.delete(5000));

})

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clear'],
  permLevel: 0
};

exports.help = {
  name: "clean",
  description: "Membersihkan chat",
  usage: "clean [amount]"
};