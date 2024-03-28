const productDetailSchema = require("../models/productDetail");

const addProduct = async (req, res) => {
  try {
    const { name, price, product_id, category, sub_category, cost_price } =
      req.body;
    console.log(name);
    const product = await productDetailSchema.create({
      name: name,
      price: price,
      product_id: product_id,
      category: category,
      sub_category: sub_category,
      cost_price: cost_price,
    });
    console.log("Added Product");
    res
      .status(201)
      .json({ product: product, message: "Added the product Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteProduct = async (req, res) => {
  const product_id = req.params.id;
  try {
    const existingProduct = await productDetailSchema.findOne({
      product_id: product_id,
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const data = await productDetailSchema.deleteOne({
      product_id: product_id,
    });
    console.log(data);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getAllData = async (req, res) => {
  try {
    const data = await productDetailSchema.find();
    res
      .status(201)
      .json({ data: data, message: "got all the products from Db" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductbyId = async (req, res) => {
  try {
    const data = await productDetailSchema.findById(req.params.id);
    res.status(201).json({ data: data });
    console.log(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getAllData, getProductbyId, deleteProduct };
