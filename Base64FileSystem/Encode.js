const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const targetDir = '';
const saveJson = '';

function encodeBase64(filePath) {
    const fileContent = fs.readFileSync(filePath);
    const compressedContent = zlib.brotliCompressSync(fileContent);
    return compressedContent.toString('base64');
}

function processDirectory(dirPath) {
    const result = {};
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            result[item] = processDirectory(fullPath);
        } else if (stats.isFile()) {
            result[item] = encodeBase64(fullPath);
        }
    });

    return result;
}

const encodedData = processDirectory(targetDir);
fs.writeFileSync(saveJson, JSON.stringify(encodedData, null, 2), 'utf-8');
console.log(`Data has been saved to ${saveJson}`);