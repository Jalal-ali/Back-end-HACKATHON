import express from 'express'
import { addProduct , getProducts , singleProduct } from '../controllers/product.controller.js'

const routes = express.Router()

// API routing 
routes.post("/product" , addProduct )
routes.get("/products" ,  getProducts )
routes.get("/product/:id" , singleProduct)


export default routes