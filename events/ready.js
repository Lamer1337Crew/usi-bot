const chalk = require('chalk');
const Discord = require('discord.js');
const settings = require('../settings.json');
const client = new Discord.Client();
const fs = require('fs');
module.exports = client => {
    console.log(chalk.bgGreen.black(`Online and ready to serve ${client.guilds.size} servers.`));  
};