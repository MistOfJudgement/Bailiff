import {Events} from "discord.js";
import {LLamainstance} from "../../text-generation/sllama.js";
export default {
    name: Events.MessageCreate,
    once: false,
    Log: console,
    async execute(msg) {
        if(!msg.guild) return;
        if (msg.author.bot) return;
        this.Log.info(`[${this.name}]: ${msg.content}`);
        if (msg.content.startsWith("-llm")) {
            const input = msg.content.replace("-llm", "").trim();
            if(input === "exit") {
                LLamainstance.exit();
                msg.channel.send("Closing server");
                return;
            }
            if(input === "init") {
                await LLamainstance.init();
                msg.channel.send("Initiated");
                return;
            }
            if(input.startsWith("system")) {
                const content = input.replace("system", "").trim();
                LLamainstance.messages = [];
                LLamainstance.messages.push({role: "system", content});
                msg.channel.send("Set system message");
                return;
            }
        } else if(msg.content.startsWith("@llm")) {
            const input = msg.content.replace("@llm", "").trim();
            await msg.channel.sendTyping();
            const output = await LLamainstance.generateText(input);
            msg.channel.send(output);
        } else if(msg.content.startsWith("-exit")) {
            //shuts down the bot
            msg.channel.send("Shutting down");
            process.exit(0);

        }
        // if(msg.content === "-join") {
        //     await audio.execute(msg);
        // }
    }
}