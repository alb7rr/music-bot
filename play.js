import playdl from "play-dl";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";

export const queues = new Map();

export default async function play(msg, query) {
  if (!query) return msg.reply("اكتب رابط أو بحث.");

  const vc = msg.member.voice.channel;
  if (!vc) return msg.reply("لازم تدخل روم صوتي.");

  if (!queues.has(msg.guild.id)) {
    queues.set(msg.guild.id, {
      connection: null,
      player: createAudioPlayer(),
      songs: [],
      playing: false
    });
  }

  const q = queues.get(msg.guild.id);

  if (!q.connection) {
    q.connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });
    q.connection.subscribe(q.player);
  }

  let info;
  if (playdl.yt_validate(query) === "video") {
    info = await playdl.video_basic_info(query);
  } else {
    const r = await playdl.search(query, { limit: 1 });
    info = await playdl.video_basic_info(r[0].url);
  }

  q.songs.push({ title: info.video_details.title, url: info.video_details.url });
  msg.reply(`✔ أضيفت: ${info.video_details.title}`);

  if (!q.playing) playNext(msg, q);
}

async function playNext(msg, q) {
  if (q.songs.length === 0) {
    q.playing = false;
    return;
  }

  const song = q.songs.shift();
  const stream = await playdl.stream(song.url);
  const res = createAudioResource(stream.stream, { inputType: stream.type });

  q.player.play(res);
  q.playing = true;
  msg.channel.send(`🎶 الآن يعمل: **${song.title}**`);

  q.player.once(AudioPlayerStatus.Idle, () => playNext(msg, q));
}
