const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const sourceJson = '';
const outputDir = '';

function decodeBase64(base64Content) {
    const compressedContent = Buffer.from(base64Content, 'base64');
    return zlib.brotliDecompressSync(compressedContent);
}

function restoreDirectory(data, dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    for (const [name, content] of Object.entries(data)) {
        const fullPath = path.join(dirPath, name);

        if (typeof content === 'object') {
            restoreDirectory(content, fullPath);
        } else {
            const fileContent = decodeBase64(content);
            fs.writeFileSync(fullPath, fileContent);
        }
    }
}

const encodedData = JSON.parse(fs.readFileSync(sourceJson, 'utf-8'));
restoreDirectory(encodedData, outputDir);
console.log(`Data has been restored to ${outputDir}`);