const express = require("express");
const router = express.Router();
const { saveFile } = require("../utils");
const finalValidator = require("../middlewares/finalValidator.js");
const { body } = require("express-validator");

const users = require("../database/users.json");


async function saveUsers() {
    await saveFile(users, "users");
};


router.post("/", [
    body("email")
        .trim()
        .isEmail().withMessage("Некорректный формат email")
        .isLength({ min: 3, max: 18 }).withMessage("Минимум 3 символа", "Максимум 18 символов")
        .normalizeEmail(),
    body("password")
        .trim()
        .isString().withMessage("password должно быть строкой")
        .isLength({ min: 6, max: 14 }).withMessage("Минимум 6 символа", "Максимум 14 символов"),
    body("name")
        .trim()
        .isString().withMessage("name должно быть строкой")
        .isLength({ min: 2, max: 18 }).withMessage("name должно быть от 2 до 18 символов"),
    body('age')
        .optional()
        .isInt({ min: 13, max: 150 }).withMessage("age должен быть числом от 13 до 150"),
    body("city")
        .optional()
        .trim()
        .isString().withMessage("city должен быть строкой"),
    body("job")
        .optional()
        .trim()
        .isString().withMessage("job должен біть строкой"),
    finalValidator
], async (req, res) => {
    const id = users.length ? (users.at(-1).id + 1) : 1;
    // тоже самое, что и вверху только без тернарника
    // let id = 1;
    // if (users.length > 0) {
    //     users.at(-1).id + 1
    // }
    const { email, password, name, age, city, job } = req.body;
    const emailUsed = !!users.find(user => user.email == email);
    if (emailUsed) {
        return res.status(403).send({ error: "Такой email уже существует" });
    }
    const newUser = { id, email, password, name, age, city, job };

    users.push(newUser);
    await saveUsers()

    res.send({ message: "Пользователь создан" });
    console.log("Пользыватель создан", req.body, newUser);
});

router.get("/", (req, res) => {
    const safeDataUsers = users.map(user => {
        // современный споб маппа из масива и вывод или по умному Деструкторизация с остатком
        const { email, password, ...rest } = user;
        return rest
        // более просто способ маппа
        // return {
        //     name: user.name,
        //     age: user.age,
        //     city: user.city,
        //     job: user.job
        // }
    });
    res.send(safeDataUsers);
});









module.exports = router;