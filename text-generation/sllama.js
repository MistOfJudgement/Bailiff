import { spawn } from 'child_process';
const https = await import('http');
class LLama{

	constructor() {
		this.serverProcess = null;
		this.messages = [];
		this.generating = false;
	}

	init() {
		if(this.serverProcess) {
			return;
		}
		this.serverProcess = spawn("sh", ["./text-generation/llamaServer.sh"]);
	}

	exit() {
		if(this.serverProcess) {
			this.serverProcess.kill();
		}
	}

	generateText(input) {
		if(!this.serverProcess) {
			return new Promise((resolve, reject) => {
				resolve("not started");
			});
		}
		if(this.generating) {
			return new Promise((resolve, reject) => {
				resolve("generating");
			});
		}
		this.generating = true;
		this.messages.push({role: "user", content: input});
		return new Promise((resolve, reject) => {
			const req = https.request({
				hostname: 'localhost',
				port: 8000,
				path: '/v1/chat/completions',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}, (res) => {
				let data = "";
				res.on('data', (d) => {
					data += d;
				});
				res.on('end', () => {
					const response = JSON.parse(data);
					this.messages.push(response.choices[0].message);
					resolve(response.choices[0].message.content);
					this.generating = false;
				});
			});
			req.on('error', (error) => {
				console.error(error);
				reject(error);
				this.generating = false;
			});
			req.write(JSON.stringify({messages: this.messages}));
			req.end();
		});
	}
}

export const LLamainstance = new LLama();