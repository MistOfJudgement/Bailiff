import {Events} from "discord.js";


export default{
    name: Events.ClientReady,
    once: true,
    Log: console,
    execute(client) {
        this.Log.info(`[${this.name}]: Client logged in as ${client.user.tag}`);

    }
}