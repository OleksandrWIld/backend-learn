const express = require("express");
const router = express.Router();
const { saveFile } = require("../utils");

const products = require("../database/products.json");

async function saveProducts() {
    await saveFile(products, "products");
};


router.get("/random", (req, res) => {
    const productIndex = Math.floor(Math.random() * products.length);
    const productRandom = products[productIndex];
    res.send(productRandom);
    console.log(productRandom);
});

router.get("/", (req, res) => {
    res.send(products);
    console.log("Отправлен", products);
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const product = products.find(product => product.id == id);
    if (!product) {
        return res.status(404).send({ error: `Не найдено продукт` });
    }
    res.send(product);
    console.log("Отправлен", product);
});

router.post("/", async (req, res) => {
    const id = products.length ? (products.at(-1).id + 1) : 1;

    const { name, price } = req.body;
    const newProduct = { id, name, price };

    products.push(newProduct);
    await saveProducts()

    res.send({ message: "Отправлено" });
    console.log("Пришло", req.body, newProduct)

});

router.patch("/:id", async (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.send({ error: "Nothing not update" });
    }
    const { id } = req.params;
    const { name, price } = req.body;

    const product = products.find(product => product.id == id);
    if (!product) return res.send({ error: "Product not found!" });

    product.name = name;
    product.price = price;
    await saveProducts()

    const message = `Product ${id} update name to "${name}" update price to "${price}"`;
    res.send({ message });
    console.log(message);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const productIndex = products.findIndex(product => product.id == id);
    if (productIndex == -1) {
        return res.status(404).send({ error: "Product not found" });
    }
    const name = products[productIndex].name;

    products.splice(productIndex, 1);
    await saveProducts()

    const message = `Product ${id} deleted. Name deleted "${name}"`;
    res.send({ message });
    console.log(message);

});

module.exports = router;