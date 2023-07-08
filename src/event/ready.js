const { ActivityType } = require('discord.js');
module.exports = async (client) => {
    client.logger.info(`[!] ${client.user.username} is now started...`)
    client.logger.info(`[!] The bot has ${client.commands.size} commands and ${client.slash.size} (/) commands`)
    client.user.setActivity(`With Lewd Thoughts`, { type: ActivityType.PLAYING })
};
