const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email обязателен для заполнения"],
        unique: true,
        lowercase: true,
        trim: true,
        select: false
    },
    password: {
        type: String,
        required: [true, "Пароль обязателен для заполнения"],
        select: false
    },
    name: {
        type: String,
        required: [true, "Имя обязателен для заполнения"],
        trim: true,
    },
    age: {
        type: Number,
    },
    city: {
        type: String,
        trim: true,
        default: "Не указан"
    },
    job: {
        type: String,
        trim: true,
        default: "Не указан"
    },
    active: {
        type: Boolean,
        default: false,
        select: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const Users = mongoose.model("users", usersSchema);
module.exports = Users;