const express = require("express");
const jwt = require("jsonwebtoken"); 
const product_model = require("../models/product_model.js"); 
const user_model = require("../models/user_model.js"); 
const cart_model = require("../models/cart_model.js");

const router = express.Router(); 

router.post("/add/:id",async(req,res) =>{

    try {
        
        const token = req.headers["token"]; 

        if(!token){
            res.status(400).json({
                success:false, 
                message:"Not logged in"
            }); 
        }

        else{

            const jwt_token = token.split(" ")[1]; 

            const decoded = jwt.verify(jwt_token,process.env.JWT_SECRET); 

            if(!decoded){
                res.status(400).json({
                    success:false, 
                    message:"Invalid token"
                }); 
            }

            else{

                const user_id = decoded.token; 

                const {id} = req.params; 

                const product = await product_model.findById(id); 

                await cart_model.create({image: product.image[0].url, name: product.name, price: product.price, quantity:1, created_by: user_id}); 

                res.status(201).json({
                    success:true, 
                    message:"Product added to cart"
                }); 

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

router.get("/all",async(req, res) =>{

    try {
        
        const token = req.headers["token"]; 

        if(!token){
            res.status(400).json({
                success:false, 
                message:"Not logged in"
            }); 
        }

        else{

            const jwt_token = token.split(" ")[1]; 

            if(!jwt_token){
                res.status(400).json({
                    success:false, 
                    message:"Token not valid"
                }); 
            }

            else{

                const decoded = jwt.verify(jwt_token,process.env.JWT_SECRET); 

                if(!decoded){
                    res.status(400).json({
                        success:false, 
                        message:"Token is not correct"
                    }); 
                }

                else{

                    const user_id = decoded.token; 

                    const products = await cart_model.find({created_by: user_id}); 

                    if(!products){
                        res.status(200).json({
                            success:true, 
                            message:"Not items added to cart"
                        }); 
                    }

                    else{

                        res.status(200).json({
                            success:true, 
                            products
                        }); 

                    }

                }

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

router.delete("/delete/:id",async(req,res) =>{

    try {
        
        const token = req.headers["token"]; 

        if(!token){
            res.status(400).json({
                success:false, 
                message:"Not logged in"
            }); 
        }

        else{

            const jwt_token = token.split(" ")[1]; 

            if(!jwt_token){
                res.status(400).json({
                    success:false, 
                    message:"Token is not present"
                }); 
            }

            else{

                const decoded = jwt.verify(jwt_token,process.env.JWT_SECRET); 

                if(!decoded){
                    res.status(400).json({
                        success:false, 
                        message:"Invalid token"
                    }); 
                }

                else{

                    const user_id = decoded.token; 

                    const {id} = req.params; 

                    if(await cart_model.find({created_by: user_id}) && await cart_model.findById(id)){

                        let product = await cart_model.findById(id); 

                        if(!product){
                            res.status(400).json({
                                success:false, 
                                message:"Invalid product id"
                            }); 
                        }

                        else{
                            await product.deleteOne(); 
                            res.status(200).json({
                                success:true, 
                                message:"Product removed from cart"
                            })
                        }

                    }

                    else{
                        
                        res.status(400).json({
                            success:false, 
                            message:"Invalid product id "
                        }); 
                    }

                }

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

module.exports = router; 