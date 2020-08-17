exports.run = (client, message) => {
  if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id !== "482706815784714272")
     return message.reply("**Anda memerlukan izin \`MANAGE_GUILD\` untuk menggunakan perintah ini!**");
    let args = message.content.split(" ").slice(1);
    message.delete();
    if (args.join(" ") === "@everyone" || args.join(" ") === "@here") return message.channel.send("Anda tidak dapat mention \`@everyone\` dan \`@here\` menggunakan bot ini!");
    message.channel.send(args.join(" "));
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "say",
    description: "Makes the bot repeat your message.",
    usage: "say [message]"
};