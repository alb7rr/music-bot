import { getVoiceConnection } from "@discordjs/voice";
import { queues } from "./play.js";

export default function stop(msg) {
  const conn = getVoiceConnection(msg.guild.id);
  if (conn) conn.destroy();

  queues.delete(msg.guild.id);

  msg.reply("🛑 تم الإيقاف ومسح الطابور.");
}
