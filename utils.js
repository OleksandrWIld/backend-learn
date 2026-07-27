const fs = require("fs/promises")

async function saveFile(data, fileName) {
    const json = JSON.stringify(data, null, 4);
    await fs.writeFile(`./database/${fileName}.json`, json);
};

module.exports = { saveFile };