import {Client, Events, GatewayIntentBits, IntentsBitField} from "discord.js"
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus
} from "@discordjs/voice"
import { createDiscordJSAdapter } from "./adapter.js"
import DISCORD_TOKEN from "./config.json" assert {type: "json"};

const player = createAudioPlayer()

function playSong() {
    const resource = createAudioResource(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        {
            inputType: StreamType.Arbitrary
        }
    )

    player.play(resource)

    return entersState(player, AudioPlayerStatus.Playing, 5e3)
}

async function connectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel)
    })

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3)
        return connection
    } catch (error) {
        connection.destroy()
        throw error
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,

    ]
})

client.on(Events.ClientReady, async () => {
    console.log("Discord.js client is ready!")

    try {
        await playSong()
        console.log("Song is ready to play!")
    } catch (error) {
        console.error(error)
    }
})

client.on(Events.MessageCreate, async message => {
    if (!message.guild) return
    console.log(message.content)
    if (message.content === "-join") {
        const channel = message.member?.voice.channel

        if (channel) {
            try {
                const connection = await connectToChannel(channel)
                connection.subscribe(player)
                message.reply("Playing now!")
            } catch (error) {
                console.error(error)
            }
        } else {
            message.reply("Join a voice channel then try again!")
        }
    }
})

let tries = 0;
function login(token) {
    client.login(token).catch(err => {
        console.log(err);
        if (tries < 5) {
            tries++;
            setTimeout(login, 4000);

        }
    })
}

login(DISCORD_TOKEN.DISCORD_TOKEN);