const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const Product = require("./models/Product")

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ProductDBMS").then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));

app.post("/api/products", async(req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/api/products", async(req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.put("/api/products/:id", async(res, req) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.json(updatedProduct);
});


app.delete("/api/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({message: "Product deleted"});
});

app.listen(5000, () => {
    console.log("Server running on port 5000 or localhost:5000");
});