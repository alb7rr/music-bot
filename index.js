import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import playCommand from './play.js';
import stopCommand from './stop.js';
import skipCommand from './skip.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const prefix = process.env.PREFIX || "!";

client.on("messageCreate", async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const [cmd, ...args] = msg.content.slice(prefix.length).split(" ");
  const command = cmd.toLowerCase();

  if (command === "ش") return playCommand(msg, args.join(" "));
  if (command === "وقف") return stopCommand(msg);
  if (command === "س") return skipCommand(msg);
});

client.once("ready", () => console.log("Bot ready:", client.user.tag));
client.login(process.env.DISCORD_TOKEN);
