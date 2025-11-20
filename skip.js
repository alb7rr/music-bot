import { queues } from "./play.js";

export default function skip(msg) {
  const q = queues.get(msg.guild.id);
  if (!q) return msg.reply("مافي شي يشتغل.");

  msg.reply("⏭ جاري التجاوز…");
  q.player.stop();
}
