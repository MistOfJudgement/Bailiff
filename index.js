// import LLama from "./text-generation/llama.js";

console.log("Hello World");

import { generate, generate2 } from "./text-generation/gpt4all.js";


// const template = `What are you?`;
// const output = await LLama.generate(template);
// console.log(output);
await generate2("What are you?");
//start chat mode
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", async (input) => {
    console.log(`Received: ${input}`);
    const output = await generate2(input);
    console.log(`[${JSON.stringify(output)}]`);
});

