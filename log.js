import fs from 'fs';
const outputFilename = 'log.txt';
const outputFile = fs.createWriteStream(outputFilename, {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

process.on('exit', function() {
    outputFile.end();
});

export default function Log(message) {
    let date = new Date();
    let time = date.toLocaleTimeString();
    let dateStr = date.toLocaleDateString();
    const log = `[${dateStr} ${time}] ${message}`;
    console.log(log);
    outputFile.write(log + '\n');
}