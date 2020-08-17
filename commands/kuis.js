const Discord = require('discord.js');
const customisation = require('../customisation.json');

const kuis = [
  { q: "apa itu Rp?", a: ["roleplay"] },
  { q: "apa itu BR?", a: ["break rules"] },
  { q: "apa itu SAMP?", a: ["san andreas multiplayer"] },
  { q: "apa nama kota 1 di GTASA?", a: ["los santos"] },
  { q: "apa itu IC?", a: ["in character"] },
  { q: "apa itu OOC?", a: ["out of character"] },
  { q: "apa itu CJ?", a: ["car jacket"] },
  { q: "apa itu MG?", a: ["meta gaming"] },
  { q: "apa itu CR?", a: ["car ramming"] },
  { q: "apa itu PG?", a: ["power gaming",] },
  { q: "apa itu DM?", a: ["death match",] },
  { q: "apa itu BH?", a: ["bunny hop",] },
  { q: "apa itu CS?", a: ["car surfing",] },
  { q: "apa itu MM?", a: ["money machine",] },
  { q: "apa itu QS?", a: ["quick scroll"] },
  { q: "apa itu OS?", a: ["olympic swimming",] },
  { q: "apa itu MF?", a: ["money farming",] },
  { q: "apa itu ER?", a: ["evading roleplay",] },
  { q: "apa itu SA?", a: ["server advertisment",] },
  { q: "apa itu RK?", a: ["revenge kill",] },
  { q: "apa itu HT?", a: ["happy triggering",] },
  { q: "apa itu Offroad?", a: ["kendaraan yang melaju di tempat yang tidak sesuai"] },
  { q: "apa itu Non Rp Drive?", a: ["berkendara secara tidak normal"] },
  { q: "apa itu Non Rp Crash?", a: ["saat kecelakaan anda tetap melanjutkan perjalanan seakan akan tidak terjadi apa apa"] },
  { q: "apa itu Non Rp Name?", a: ["mempunyai nama yang tidak sesuai dengan dunia nyata"] },
  { q: "apa itu Abuse Static Vehicle?", a: ["menyalah gunakan kendaraan fraksi untuk kepentingan pribadi"] },
  { q: "apa itu Force Rp?", a: ["memaksakan kehendak roleplay sesuai keinginan kamu sendiri tanpa memberikan lawan rp kamu untuk membalas rp"] },
  { q: "apa itu MetaGaming?", a: ["menggunakan saran atau informasi OOC untuk keperluan IC"] },
  { q: "apa itu Power Gaming?", a: ["melakukan hal mustahil yang tidak akan pernah bisa kalian lakukan di kehidupan nyata namun dapat dilakukan didalam game"] },
  { q: "apa itu Mixxing?", a: ["mencampurkan hal OOC kedalam IC atau sebaliknya"] },
  { q: "apa itu Chicken Running?", a: ["berlari zig-zag untuk menghindari tembakan"] },
  { q: "apa itu Car Ramming?", a: ["menabrakkan kendaraan kalian keorang tanpa alasan atau bermaksud untuk trolling"] },
  { q: "apa itu Olympic Swimming?", a: ["menceburkan atau melarikan diri ke air dan menyelam untuk menghindari tembakan atau shootout"] },
  { q: "apa itu Ramboing?", a: ["membawa senjata atau peluru yang sangat banyak"] },
  { q: "apa itu Revenge Kill?", a: ["membunuh orang yang baru saja membunuh kalian"] },
  { q: "apa itu Flamming?", a: ["menyindir orang di OOC Channel"] },
  { q: "apa itu OOC Lie?", a: ["berbohong di channel OOC"] },
  { q: "apa itu Money Farming?", a: ["membuat account baru dan men-transfer uangnya ke account utama kalian"] },
  { q: "apa itu Money Machine?", a: ["lebih mementingkan uang daripada ber-roleplay"] },
  { q: "apa itu Refill at War?", a: ["mengisi ulang darah kalian menggunakan pot atau first aid kit saat berperang / shootout"] },
 
 
 
];

const options = {
  max: 1,
  time: 60000,
  errors: ["time"],
};
 
exports.run = async (client, message, args) => {
 
  const item = kuis[Math.floor(Math.random() * kuis.length)];
  await message.channel.send(item.q);
  try {
    const collected = await message.channel.awaitMessages(answer => item.a.includes(answer.content.toLowerCase()), options);
    const winnerMessage = collected.first();
    return message.channel.send({embed: new Discord.RichEmbed()
                                 .setAuthor(`Selamat kamu benar ${winnerMessage.author.tag}`, client.user.avatarURL)
                                 .setTitle(`Jawaban benar: \`${winnerMessage.content}\``)
                                 .setFooter(`Pertanyaan: ${item.q}`)
                                 .setColor(`${customisation.color}`)
                                })
    .catch(console.error)
  } catch (_) {
    return message.channel.send({embed: new Discord.RichEmbed()
                                 .setAuthor('Jawabanmu salah sana belajar RP lagi!', client.user.avatarURL)
                                 .setTitle(`Jawaban yang benar(s): \`${item.a}\``)
                                 .setFooter(`Pertanyaan: ${item.q}`)
                                 .setColor(`${customisation.color}`)
                                })
    .catch(console.error)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  pernLever: 0
};
 
exports.help = {
  name: "kuis",
  description: "Kuis Rp",
  usage: 'kuis'
};