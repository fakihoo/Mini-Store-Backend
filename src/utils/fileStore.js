const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const cache = {};
let writeQueue = Promise.resolve();

function filePath(name) {
    return path.join(dataDir, `${name}.json`);
}

function read(name) {
    if (!(name in cache)) {
        try {
            const raw = fs.readFileSync(filePath(name), 'utf8');
            cache[name] = JSON.parse(raw);
        } catch (e) {
            cache[name] = [];
        }
    }
    return cache[name];
}

function write(name, data) {
    cache[name] = data;
    writeQueue = writeQueue.then(() => {
        fs.mkdirSync(dataDir, { recursive: true });
        const tmpPath = filePath(name) + '.tmp';
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
        fs.renameSync(tmpPath, filePath(name));
    });
    return writeQueue;
}

module.exports = { read, write, dataDir };
