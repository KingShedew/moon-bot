const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const config = require('./config.json');
const blockedWords = require('./blockedWords.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    // Ignore bots
    if (message.author.bot) return;

    // Ignore admins
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return;
    }

    const content = message.content.toLowerCase();

    for (const word of blockedWords) {

        if (content.includes(word.toLowerCase())) {

            try {

                // Delete the message
                await message.delete();

                // Timeout user for 5 minutes
                await message.member.timeout(
                    5 * 60 * 1000,
                    `Used blocked word: ${word}`
                );

                // Send warning
                await message.channel.send(
                    `${message.author} was timed out for saying a blocked word.`
                );

                console.log(`${message.author.tag} used: ${word}`);

            } catch (err) {
                console.error(err);
            }

            break;
        }
    }
});

client.login(config.token);
