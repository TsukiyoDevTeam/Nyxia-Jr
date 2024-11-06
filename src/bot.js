const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

require('colors');

let client;

const clientraw = new Discord.Client({
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent 
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.MessageContent,
        // Discord.GatewayIntentBits.GuildPresences
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildMessagePolls,
        Discord.GatewayIntentBits.DirectMessagePolls,
        Discord.GatewayIntentBits.AutoModerationExecution,
        Discord.GatewayIntentBits.AutoModerationConfiguration
    ],
});

if (process.env.use_proxy && process.env.use_proxy === "yes") {
    client = new ProxyClient(client);
} else {
    client = clientraw;
}

client.commands = new Collection();

async function start() {

    async function loadModules() {
    const moduleFiles = fs.readdirSync(path.join(__dirname, "modules"));

    for (const x of moduleFiles) {
        const modulePath = path.join(__dirname, "modules", x)
        const filename = x.replace(".js", "")
        if (filename === "proxy") continue;

        if (
            fs.existsSync(modulePath) && 
            x.endsWith(".js") &&
            !x.startsWith("_")
        ) 
        {
            const y = require(modulePath);
            if (y.init) {
                y.init(client);
            }
        }

    }
    }


    await loadModules()
    await client.login(token)
}


start()

module.exports = client;

