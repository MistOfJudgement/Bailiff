import {ActivityType, Events} from "discord.js";


export default{
    name: Events.ClientReady,
    once: true,
    Log: console,
    execute(client) {
        this.Log.info(`[${this.name}]: Client logged in as ${client.user.tag}`);
        client.user.setPresence({ activities: [{ name: 'you :eyes:', type: ActivityType.Watching }], status: 'idle' });
        this.Log.info(`[${this.name}]: Set presence as ${client.user.presence.activities[0].name}`);

    }
}