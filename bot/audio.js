const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const {createDiscordJSAdapter} =  require("./adapter");

const player = createAudioPlayer();

function playSong() {
    const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
        inputType: StreamType.Arbitrary,
    });
    player.play(resource);
}

async function connectToChannel(channel) {
    /**
     * Here, we try to establish a connection to a voice channel. If we're already connected
     * to this voice channel, @discordjs/voice will just return the existing connection for us!
     */
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel),
    });

    /**
     * If we're dealing with a connection that isn't yet Ready, we can set a reasonable
     * time limit before giving up. In this example, we give the voice connection 30 seconds
     * to enter the ready state before giving up.
     */
    try {
        /**
         * Allow ourselves 30 seconds to join the voice channel. If we do not join within then,
         * an error is thrown.
         */
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        /**
         * At this point, the voice connection is ready within 30 seconds! This means we can
         * start playing audio in the voice channel. We return the connection so it can be
         * used by the caller.
         */
        return connection;
    } catch (error) {
        /**
         * At this point, the voice connection has not entered the Ready state. We should make
         * sure to destroy it, and propagate the error by throwing it, so that the calling function
         * is aware that we failed to connect to the channel.
         */
        connection.destroy();
        throw error;
    }
}

module.exports = {
    name: 'play',
    description: 'Play a song',
    async execute(msg) {
        const channel = msg.member?.voice.channel;
        if (!channel) return msg.reply('You need to be in a voice channel to use this command');

        const connection = await connectToChannel(channel);
        connection.subscribe(player);

        playSong();

        try {
            await entersState(player, AudioPlayerStatus.Idle, 5_000);
            connection.destroy();
            msg.reply('Left voice channel');
        } catch (error) {
            connection.destroy();
            throw error;
        }
    }

}