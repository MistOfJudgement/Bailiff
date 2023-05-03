import {Events} from "discord.js";
import llama from "../../text-generation/llama.js";
export default {
    name: Events.MessageCreate,
    once: false,
    Log: console,
    async execute(msg) {
        if(!msg.guild) return;
        if (msg.author.bot) return;
        this.Log.info(`[${this.name}]: ${msg.content}`);
        if(msg.content.startsWith("@llm")) {
            const command = msg.content.slice(6);
            const output =  llama.generate(command, msg.author.username);
            msg.channel.send(output);
        }
        // if(msg.content === "-join") {
        //     await audio.execute(msg);
        // }
    }
}