const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

// Se the status
client.on("ready", () => {
    console.log(`I'm online, my name is ${client.user.username}`);
    client.user.setPresence({
        status: "online",
        game: {
            name: "Me getting developed",
            type: "WATCHING"
        }
    });
});

client.on("message", async message => {
    const prefix = "_";
    if (message.author.bot) {
        console.log("Not author message");
        return;
    }
    // User's direct messages
    if (!message.guild) {
        console.log("Not guild");
        return;
    }
    if (!message.content.startsWith(prefix)) {
        console.log("Not starting with the prefix");
        return;
    }
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0 ) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
        command.run(client, message, args);
    }
});

client.login(process.env.TOKEN);