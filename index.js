// import LLama from "./text-generation/llama.js";
import { LLamainstance } from "./text-generation/sllama.js";
console.log("Hello World");



// const template = `What are you?`;
// const output = await LLama.generate(template);
// console.log(output);

//start chat mode
import readline from "readline";

LLamainstance.init();
LLamainstance.messages.push({role: "system", content: "You are a helpful assistant."});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (input) => {
    console.log(`Received: ${input}`);
    if(input === "exit") {
        LLamainstance.exit();
        rl.close();
        return;
    }
    const output = await LLamainstance.generateText(input);
    console.log(`[${output}]`);
});

// rl.on("line", async (input) => {
//     console.log(`Received: ${input}`);
//     const output = await LLama.generate(input, "Kasumi");
//     console.log(`[${output}]`);
// });

