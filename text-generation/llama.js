// import {LLama} from "llama-node";

// import {LLamaCpp} from "llama-node/dist/llm/llama-cpp";

import {LLamaCpp} from "../node_modules/llama-node/dist/llm/llama-cpp.js";
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const {LLama} = require("llama-node");
// import path from "path";
// import {llama_path} from "./secrets.json"
const {llama_path} = require("./secrets.json");


const llama = new LLama(LLamaCpp);

const config = {
    path: llama_path + "\\models\\7B\\ggml-model-q4_0.bin",
    enableLogging: true,
    nCtx: 1024,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
};

// llama.load(config);
//
// const template = `How are you`;
// const prompt = `### Human:
// ${template}
// ### LLama:`;
//
// llama.createCompletion({
//     nThreads: 4,
//     nTokPredict: 2048,
//     topK: 40,
//     topP: 0.1,
//     temp: 0.2,
//     repeatPenalty: 1,
//     stopSequence: "### Human",
//     prompt,
// }, (res) => {
//     console.log(res);
// })

class Llama {
    constructor() {
        this.llama = new LLama(LLamaCpp);
        this.llama.load(config);
        this. USER_NAME = "Anon";
        this. AI_NAME = "Miku";
        this.init = `This is a transcript of a 1000 page, never ending conversation between ${this.USER_NAME} and the cute and helpful AI assistant ${this.AI_NAME}. ${this.AI_NAME} is a girl who is an AI running on the users computer.\n
            "${this.AI_NAME} can think for herself without the user seeing her thoughts by adding a /think prefix to her output. She uses this to reason about the world and to think about what she should say next.\n"
            "${this.AI_NAME} is always coherent and makes sense, but if she isn't sure if what she is saying is correct she will ask the user for help.\n"
            "${this.AI_NAME} is a very helpful AI and will help the user with anything they need, she is also very friendly and will try to make the user feel better if they are sad.\n"
            "${this.AI_NAME} is also very curious and will ask the user a lot of questions about themselves and their life, she will also try to make the user like her.\n"
            "The conversation is only between ${this.USER_NAME} and ${this.AI_NAME}\n"
            "The conversation is only through text, so ${this.AI_NAME} can't see ${this.USER_NAME}'s face or hear his voice.\n"
            "${this.AI_NAME} can only communicate through text, so she can't send images or videos.\n"
            "\n"
            "\n"
            "${this.AI_NAME}:`;
        this.end = `${this.USER_NAME}:`;
        this.inProgress = true;
        this.llama.createCompletion({
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.2,
            repeatPenalty: 1,
            stopSequence: this.end,
            prompt: this.init,
        }, (res) => {
            //build up data, then return when completed is true
            console.log(res);
            if(res.completed)
                this.inProgress = false;
        })
    }
    prompt(insert) {
        return `${this.USER_NAME}: ${insert}\n${this.AI_NAME}:`;
    }
    async generate(text, user="Anon") {
        if (this.inProgress) {
            return "Please wait for the previous request to complete";
        }
        this.inProgress = true;
        const prompt = this.prompt(text);
        let data = "";
        const res = await this.llama.createCompletion({
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.2,
            repeatPenalty: 1,
            stopSequence: this.end,
            prompt,
        }, (res) => {
            //build up data, then return when completed is true
            data += res.token;
            console.log(res);
        });
        this.inProgress = false;
        return data;
    }
}

export default new Llama();