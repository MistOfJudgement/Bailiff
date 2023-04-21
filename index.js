import LLama from "./text-generation/llama.js";

console.log("Hello World");



// const template = `What are you?`;
// const output = await LLama.generate(template);
// console.log(output);

//start chat mode
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", async (input) => {
    console.log(`Received: ${input}`);
    const output = await LLama.generate(input);
    console.log(`[${output}]`);
});

