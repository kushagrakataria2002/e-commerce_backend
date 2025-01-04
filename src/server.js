const express = require("express"); 
const body_parser = require("body-parser"); 
require("dotenv").config({path:"./src/.env"}); 
const user_router = require("../routes/user.js"); 
require("./connecting_db.js"); 
const cors = require("cors"); 
const product_router = require("../routes/product.js"); 
const cart_router = require("../routes/cart.js"); 

//creating a server 

const app = express(); 

app.use(cors()); 
app.use(body_parser.urlencoded({extended:true})); 
app.use(express.json()); 
app.use('/user',user_router); 
app.use("/product",product_router); 
app.use("/cart", cart_router); 

app.listen(process.env.PORT, (req,res) =>{
    console.log(`server is working on http://localhost:${process.env.PORT}`); 
})