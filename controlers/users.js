const express = require("express");
const mongoose = require("mongoose")
const { body, param } = require("express-validator");

const { saveFile, getGeneratePassword } = require("../utils");
const finalValidator = require("../middlewares/finalValidator.js");
const Users = require("../models/users.model.js");

const router = express.Router();

const idValidator = param("id").isMongoId().withMessage("id обязателен")

router.post("/", [
    body("email")
        .trim()
        .isEmail().withMessage("Некорректный формат email")
        .isLength({ min: 3, max: 18 }).withMessage("Минимум 3 символа")
        .normalizeEmail(),
    body("password")
        .trim()
        .isString().withMessage("password должно быть строкой")
        .isLength({ min: 6, max: 20 }).withMessage("Минимум 6 символа"),
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
        .isString().withMessage("job должен быть строкой"),
    finalValidator
], async (req, res) => {
    const { email, password, name, age, city, job } = req.body;

    const similarUserEmail = await Users.findOne({ email: email });
    if (similarUserEmail) return res.send({ error: "Такой Email уже есть!" });
    try {
        const newUser = await Users.create({ email, password, name, age, city, job });
        res.send(newUser);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await Users.find().select("+email, +password");
        res.send(users);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get("/:id", [
    idValidator,
    finalValidator
], async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findOne({ _id: id }, "+email +password +active");
        if (!user.active) {
            return res.send({ message: "Юзер ещё не активирован" });
        }
        res.send(user);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.patch("/:id/activate", [
    idValidator,
    finalValidator
], async (req, res) => {
    const { id } = req.params;
    try {
        // Метод через updateOne
        //     const updateData = await Users.updateOne({ _id: id, active: false }, {
        //         $set: { active: true },
        //     });
        //     if (!updateData.modifiedCount) {
        //         return res.status(404).send({ message: "Юзер уже активирован" })
        //     }
        //     res.send({ message: "Юзер активирован" });

        // Метод через FindOne (лучше)
        const user = await Users.findOne({ _id: id }, "active");
        if (!user) {
            return res.status(404).send({ message: "Юзер не наййден" });
        }
        if (user.active) {
            return res.status(404).send({ message: "Юзер уже активирован" })
        }
        user.active = true
        await user.save();
        res.send({ message: "Юзер активирован" });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Users.deleteOne({ _id: id });
        if (!data.deletedCount) {
            return res.status(404).send({ message: "Юзер не найден" });
        }
        res.send({ message: "Юзер удалён" });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});


module.exports = router;