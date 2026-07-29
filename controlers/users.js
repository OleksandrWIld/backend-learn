const express = require("express");
const router = express.Router();
const { saveFile } = require("../utils");

const products = require("../database/users.json");
const { validationResult } = require("express-validator");

async function saveProducts() {
    await saveFile(products, "products");
};

function finalValidator(req, res, next) {
    const errors = validationResult(req)
    if (errors.array().length) {
        const parsedErrors = errors.array().map(err => ({ message: err.msg, field: err.path }));
        return res.status(400).send(parsedErrors);
    }
    return next()
}










module.exports = router;