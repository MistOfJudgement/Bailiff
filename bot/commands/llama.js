import Log from "../../log.js";
// import llama from "../../text-generation/llama.js";
import { generate } from "../../text-generation/gpt4all.js";
const temp = {
    type: "message",
    name: "llama",
    async execute(message) {
        Log(`[${this.name}]: ${message.cleanContent}`);
        await message.channel.sendTyping();
        // const output = await llama.generate(message.cleanContent.match(/-llama(.*)/)[1]);
        const output = await generate(message.cleanContent.match(/-llama(.*)/)[1]);
        Log(`[${this.name}]: Generated [${output}]`);
        if(!output) return message.channel.send("There was an error. Whoops");
        message.channel.send(output);
    }
}
export default temp;