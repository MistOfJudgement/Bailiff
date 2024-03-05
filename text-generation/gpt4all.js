// https://docs.gpt4all.io/gpt4all_nodejs.html

import { createCompletion, loadModel } from 'gpt4all'
import Log from "../log.js";
const model = await loadModel('mistral-7b-openorca.Q4_0.gguf', { verbose: true });
let messages = []

export async function generate(text) {
    messages.push({role: "user", content: text});
    const completion =  await createCompletion(model, 
    messages, {promptTemplate: "### Human:\n" +
    "%1\n" +
    "### Assistant:\n" +
    ""});
    console.log(completion);
    return completion.choices[0].message.content;
}

export async function generate2(text) {
    //makes a request to server localhost:8080 for the completion
    const response = await fetch('http://127.0.0.1:8000/generate?prompt=' + encodeURIComponent(text), {
        method: 'POST',
        body: JSON.stringify({prompt: text}),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'same-origin'
    });
    const json = await response.json();
    return json;
}