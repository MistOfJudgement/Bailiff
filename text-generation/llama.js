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
        this.inProgress = false;
    }

    async generate(text) {
        if (this.inProgress) {
            return "Please wait for the previous request to complete";
        }
        this.inProgress = true;
        const template = `${text}`;
        const prompt = `### Human:
${template}
### LLama:`;
        let data = "";
        const res = await this.llama.createCompletion({
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.2,
            repeatPenalty: 1,
            stopSequence: "### Human",
            prompt,
        }, (res) => {
            data += res.token;
            if (res.completed) {
                this.inProgress = false;

            }
        });

        return res;

    }
}

export default Llama;