import mongoose from "mongoose";
import Products from "../models/product.model.js";

// add product to db  
 const addProduct = async (req , res) => {

const {title , description} = req.body

// condition for title or description missing 
if(!title || !description){
    res.status(400).json({
        message : "Title and Description is required."
    })
    return;
}
 const product = await Products.create(
    {
        title ,
        description
    }
 )
 res.status(201).json({
    message : "Product added to Database successfully!",
    data : product
 })

}

// get all products from db 
const getProducts = async (req , res) => {
        const products = await Products.find({})
        res.status(200).json({
                products : products
    })
}

// get single product by id
const singleProduct = async (req , res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not valid Id" });
      }
      const product = await Products.findById(id);
      if (!product) {
            res.status(404).json({
                  message: "No product found!",
                });
        return;
      }
      res.status(200).json(product)
}

export {addProduct , getProducts , singleProduct}