const express = require("express");
const router = express.Router();
const { saveFile } = require("../utils");
const finalValidator = require("../middlewares/finalValidator.js");

const products = require("../database/products.json");
const { body, param, query } = require("express-validator");

async function saveProducts() {
    await saveFile(products, "products");
};

const paramId = param("id").isInt().withMessage("Id дисктует целым числом(Вадим Колбасенко)");
const bodyName = body("name").isString().withMessage("name должен быть строкой");
const bodyPrice = body("price")
    .isInt().withMessage("price должен быть целым числом ")
    .custom(value => typeof (value) == "number").withMessage("price должен быть ИМЕННО числом");

router.get("/random", (req, res) => {
    const productIndex = Math.floor(Math.random() * products.length);
    const productRandom = products[productIndex];
    res.send(productRandom);
    console.log(productRandom);
});

router.get("/", [
    query("count").optional().isInt({ min: 1 }).withMessage("count должен быть числом > 1"),
    finalValidator
], (req, res) => {
    const count = req.query.count;
    if (count) {
        const slicedProducts = products.slice(0, count);
        return res.send(slicedProducts);
    }
    res.send(products);
    console.log("Отправлен", products);
});

router.get("/search", [
    query("name").optional().isString().withMessage("name должен быть строкой"),
    query("price").optional().isInt().withMessage("price должен быть числом"),
    finalValidator
], (req, res) => {
    const searchName = req.query.name;
    const searchPrice = req.query.price;

    // фильтрация через фулл ифы под множиство условий
    const filterProducts = products.filter(product => {
        let match = false;
        if (searchName) {
            if (product.name.includes(searchName)) {
                match = true;
            }
            else {
                return false;
            }
        }
        if (searchPrice) {
            if (product.price == searchPrice) {
                match = true;
            }
            else {
                return false;
            }
        }
        return match;
    });

    res.send(filterProducts)

    // Сокращённый вариант ифов под множество условий
    // let filterProducts = products;
    // if (searchName) {
    //     filterProducts = filterProducts.filter(product => {
    //         return (product.name.includes(searchName));
    //     });
    // }
    // if (searchPrice) {
    //     filterProducts = filterProducts.filter(product => {
    //         return (product.price == searchPrice);
    //     })
    // }
    // console.log(filterProducts);
    // return res.send(filterProducts);

    // самый сокращённый вариант иффов под множеством условий
    // let filtered = products;
    // if (searchName) filtered = filtered.filter(p => (p.name.includes(searchName)));
    // if (searchPrice) filtered = filtered.filter(p => (p.price == searchPrice));
    // res.send(filtered);
});

router.get("/:id", [
    paramId,
    finalValidator
], (req, res) => {
    const id = req.params.id;
    const product = products.find(product => product.id == id);
    if (!product) {
        return res.status(404).send({ error: `Не найдено продукт` });
    }
    res.send(product);
    console.log("Отправлен", product);
});

router.post("/", [
    bodyName,
    bodyPrice,
    finalValidator
], async (req, res) => {
    const id = products.length ? (products.at(-1).id + 1) : 1;

    const { name, price } = req.body;
    const newProduct = { id, name, price };

    products.push(newProduct);
    await saveProducts()

    res.send({ message: "Отправлено" });
    console.log("Пришло", req.body, newProduct)

});

router.patch("/:id", [
    paramId,
    bodyName,
    bodyPrice,
    finalValidator
], async (req, res) => {
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

router.delete("/:id", [
    paramId,
    finalValidator
], async (req, res) => {
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