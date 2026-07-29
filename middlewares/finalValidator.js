const { validationResult } = require("express-validator");

function finalValidator(req, res, next) {
    const errors = validationResult(req)
    if (errors.array().length) {
        const parsedErrors = errors.array().map(err => ({ message: err.msg, field: err.path }));
        return res.status(400).send(parsedErrors);
    }
    return next()
};

module.exports = finalValidator