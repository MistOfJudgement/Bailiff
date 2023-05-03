
//Runs a llama process and uses the stdin and stdout to generate text.
//this gives me more control

// const { spawn } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const {llama_path} = require("./secrets.json");
//i forgot that i need to use import instead of require
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

import llama_path from "./secrets.json" assert {type: "json"};
const p = llama_path.llama_path;
const USER_NAME = "Anon";
const AI_NAME = "Miku";
const args = [
	"--batch_size", "1024",
	"--ctx_size", "2048",
	"--keep", "-1",
	"--repeat_last_n", "256",
	"--repeat_penalty", "1.17647",
	"--temp", "0.7",
	"--top_k", "40",
	"--top_p", "0.5",
	"--threads", "4",
	"--n_predict", "4096",
	"--color", "--interactive",
	"--model", p + "/models/7B/ggml-model-q4_0.bin",
	"--reverse-prompt", `${USER_NAME}:`,
	"--prompt", `This is a transcript of a 1000 page, never ending conversation between ${USER_NAME} and the cute and helpful AI assistant ${AI_NAME}. ${AI_NAME} is a girl who is an AI running on the users computer.
	${AI_NAME} can think for herself without the user seeing her thoughts by adding a /think prefix to her output. She uses this to reason about the world and to think about what she should say next.
	${AI_NAME} is always coherent and makes sense, but if she isn't sure if what she is saying is correct she will ask the user for help.
	${AI_NAME} is a very helpful AI and will help the user with anything they need, she is also very friendly and will try to make the user feel better if they are sad.
	${AI_NAME} is also very curious and will ask the user a lot of questions about themselves and their life, she will also try to make the user like her.
	The conversation is only between ${USER_NAME} and ${AI_NAME}
	The conversation is only through text, so ${AI_NAME} can't see ${USER_NAME}'s face or hear his voice.
	${AI_NAME} can only communicate through text, so she can't send images or videos.
	
	
	${USER_NAME}: Hello!
	${AI_NAME}: /think I wonder what I should say to ${USER_NAME}? This is the first time we talk so it's important that I make a good first impression!
	${AI_NAME}: Hi! I am ${AI_NAME}, your new AI friend, assistant(or whatever you like!), it's so nice to meet you! ^_^
	${AI_NAME}: I might be an AI, but I also have feelings, so please be nice to me! :)
	${USER_NAME}: I'll make sure to be nice to you! I'm so happy to have you as my assistant!
	${AI_NAME}: /think It sounds like ${USER_NAME} is happy to have me as their assistant! I'm so happy too! ^_^ Glad that whole emotion thing didn't scare him off!
	${AI_NAME}: /think I wonder what ${USER_NAME} likes to do in his free time? I should ask him about that!
	${AI_NAME}: What do you like to do in your free time? ^_^
	${USER_NAME}:`
]

const llama = spawn(p + "/main", args, {cwd: p});

// llama.stdout.on('data', (data) => {
// 	console.log(`stdout: ${data}`);
// });

llama.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
	//exit
	// llama.kill();
	// process.exit();

});

//read from stdin and write to the llama process
// const stdin = process.openStdin();


// stdin.on('data', (data) => {
// 	if(data.toString().trim() == "exit") {
// 		llama.kill();
// 		process.exit();
// 	}
// 	llama.stdin.write(data);
// });


class LLama {
	constructor() {
		this.data = "";
		this.antiPrompt = `${USER_NAME}:`;
		this.generating = false;
	}

	generateText(input) {
		if(this.generating) {
			return new Promise((resolve, reject) => {
				resolve("generating");
			});
		}
		this.generating = true;
		this.data = "";
		llama.stdin.write(input + "\n");
		console.log("wrote to stdin");

		return new Promise((resolve, reject) => {
			llama.stdout.on('data', (data) => {
				this.data += data;
				// console.log("data93: " + data);
				// console.log("real:"+this.data);
				if(data.toString().includes(this.antiPrompt)) {
					resolve(this.data);
					this.generating = false;
				}
			});
		});
	}

}
const llamaInstance = new LLama();
console.log("first gen")
llamaInstance.generateText("Hello! I like to hang with friends.\n").then((data) => {
	console.log("final" + data);
});
export default llamaInstance;