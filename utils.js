const fs = require("fs/promises")

async function saveFile(data, fileName) {
    const json = JSON.stringify(data, null, 4);
    await fs.writeFile(`./database/${fileName}.json`, json);
};

function getGeneratePassword(min = 6, max = 18) {
    let password = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    const length = Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < length; i++) {
        // ПОКАЗАТЬ СЕРЁГЕ
        // password += chars[Math.floor(Math.random() * chars.length)];
        let randomIndex = Math.floor(Math.random() * chars.length);
        let char = chars[randomIndex];
        password = password + char;
    }
    return password
};

module.exports = { saveFile, getGeneratePassword };