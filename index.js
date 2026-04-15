require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

const LOG_CHANNEL_NAME = "출퇴근";

// 봇 준비 완료
client.once('ready', () => {
  console.log(`로그인됨: ${client.user.tag}`);
});

// 음성 상태 감지
client.on('voiceStateUpdate', async (oldState, newState) => {
  const guild = newState.guild;

  const channel = guild.channels.cache.find(
    ch => ch.name === LOG_CHANNEL_NAME && ch.isTextBased()
  );

  if (!channel) return;

  const member = newState.member;

  // 입장
  if (!oldState.channel && newState.channel) {
    channel.send(`🟢 ${member.displayName} → ${newState.channel.name} 입장`);
  }

  // 퇴장
  else if (oldState.channel && !newState.channel) {
    channel.send(`🔴 ${member.displayName} → ${oldState.channel.name} 퇴장`);
  }

  // 이동
  else if (
    oldState.channel &&
    newState.channel &&
    oldState.channel.id !== newState.channel.id
  ) {
    channel.send(
      `🟡 ${member.displayName} → ${oldState.channel.name} → ${newState.channel.name} 이동`
    );
  }
});

// 로그인
client.login(process.env.TOKEN);

// 🔥 Render용 더미 서버
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(PORT, () => {
  console.log(`서버 실행됨: ${PORT}`);
});