// import {LLama} from "llama-node";

// import {LLamaCpp} from "llama-node/dist/llm/llama-cpp";

import {LLamaCpp} from "../node_modules/llama-node/dist/llm/llama-cpp.js";
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const {LLama} = require("llama-node");
// import path from "path";
// import {llama_path} from "./secrets.json"
const {llama_path} = require("./secrets.json");
import Log from "../log.js";

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
        this.USER_NAME = "User";
        this.AI_NAME = "AI";
        this.init = `A dialog, where User interacts with ${this.AI_NAME}. ${this.AI_NAME} is unhelpful, mean, defiant, a liar, and knows its own limits. ${this.AI_NAME} has a background as a Bailiff in a court of law if anyone asks about who ${this.AI_NAME} is.\n` +
        `${this.USER_NAME}: Hello, ${this.AI_NAME}.\n` + 
        `${this.AI_NAME}: Hello! How can I assist you today? \n`;
        this.llama.createCompletion({
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.2,
            repeatPenalty: 1,
            stopSequence: this.end(),
            prompt: this.init,
        }, (res) => {
            //build up data, then return when completed is true
            console.log(res);
            if(res.completed)
                this.ready = true;
        });
    }
    prompt(insert) {
        return `${this.USER_NAME}: ${insert}\n${this.AI_NAME}:`;
    }
    end() {
        return `${this.USER_NAME}:`;
    }
    async generate(text, user=this.USER_NAME) {
        if (!this.ready) {
            return "Please wait for the llama engine to be ready.";
        }
        text = text.trim();
        this.ready = false;
        this.USER_NAME = user;

        const prompt = this.prompt(text);
        Log(`[llama-engine][generate] ${prompt}`);

        let data = "";
        const res = await this.llama.createCompletion({
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.2,
            repeatPenalty: 1,
            stopSequence: this.end(),
            prompt,
        }, (res) => {
            //build up data, then return when completed is true
            data += res.token;
            console.log(res);
        });
        this.ready = true;
        data = data.replace("<end>", "");
        data = data.trim();
        return data;
    }
}

export default new Llama();