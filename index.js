const express = require("express");
const app = express();
const productsRouter = require("./controlers/products");
const usersRouter = require("./controlers/users");
const mongoose = require("mongoose");
require('dotenv').config({ quiet: true });


app.use(express.json());
app.use("/products", productsRouter);
app.use("/users", usersRouter);


// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         error: err.message || "Ошибка сервера"
//     });
//     console.log(err.message || "Ошибка сервера");
// });

app.listen(process.env.PORT, async () => {
    console.log("Server start")
    try {
        await mongoose.connect("mongodb://localhost:27017/learn_backend")
        console.log("Database connected")
    }
    catch (error) {
        console.error("Database NOT connected", error)
    }
});

