const { Collection, InteractionType } = require('discord.js');

module.exports = async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        // Ensure the interaction is from a guild (not a DM)
        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        // Ensure the command exists in the slash commands collection
        if (!client.slashCommands.has(interaction.commandName)) {
            return interaction.reply({ content: 'Unknown command.', ephemeral: true });
        }

        const command = client.slashCommands.get(interaction.commandName);

        try {
            // Handle cooldowns
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 2) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: `Wait ${timeLeft.toFixed(1)} more second${timeLeft.toFixed(1) < 2 ? '' : 's'} to use **${command.name}**`,
                        ephemeral: true
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            // Ensure interaction.member exists and is from the guild
            if (interaction.guild && interaction.member) {
                if (command.permissions) {
                    if (!interaction.member.permissions.has(command.permissions)) {
                        return interaction.reply({
                            content: `You're missing permissions: ${command.permissions.map(p => `**${p}**`).join(', ')}`,
                            ephemeral: true
                        });
                    }
                }
            } else {
                // If interaction.member is still undefined, it means something went wrong
                return interaction.reply({
                    content: 'Error: Member information is unavailable. Please make sure the bot has proper permissions.',
                    ephemeral: true
                });
            }

            // Run the command
            await command.run(client, interaction);

        } catch (e) {
            console.log(e);
            await interaction.reply({
                content: 'An error has occurred while processing the command.',
                ephemeral: true
            });
        }
    }
};
