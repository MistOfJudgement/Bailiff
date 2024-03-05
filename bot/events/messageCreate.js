import {Events} from "discord.js";
import Log from "../../log.js";
const prefix = "-";


export default {
    name: Events.MessageCreate,
    once: false,
    async execute(msg) {
        if(!msg.guild) return;
        if (msg.author.bot) return;
        Log(`[${this.name}]: ${msg.content}`);
        for (const command of msg.client.messageCommands.values()) {
            if (msg.content.startsWith(prefix + command.name)) {
                try {
                    await command.execute(msg);
                } catch (error) {
                    this.Log.error(error);
                    await msg.reply({content: "There was an error. Whoops", ephemeral:true});
                }
            }
        }
        // this.Log.info(`[${this.name}]: ${msg.content}`);

        // if(msg.content === "-join") {
        //     await audio.execute(msg);
        // }
    }
}