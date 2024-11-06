const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async function int(client) {
    
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => 
                file.endsWith('.js') &&
                !file.startsWith("_")
            );
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        try {
            console.log(`Registering ${commands.length} commands...`);
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_ID),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${data.length} commands`);
        } catch (error) {
            console.error(error);
        }
}