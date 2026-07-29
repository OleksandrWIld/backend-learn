const express = require("express");
const router = express.Router();
const { saveFile } = require("../utils");
const finalValidator = require("../middlewares/finalValidator.js");

const users = require("../database/users.json");


async function saveUsers() {
    await saveFile(users, "users");
};











module.exports = router;