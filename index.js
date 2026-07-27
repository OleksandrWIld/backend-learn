const express = require("express");
const app = express();
const productsRouter = require("./controlers/products");


app.use(express.json());
app.use("/products", productsRouter);


// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         error: err.message || "Ошибка сервера"
//     });
//     console.log(err.message || "Ошибка сервера");
// });

app.listen(8000, async () => {
    console.log("Server start")
});

