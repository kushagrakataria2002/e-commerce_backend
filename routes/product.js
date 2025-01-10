const express = require("express"); 
const jwt = require("jsonwebtoken"); 
const product_model = require("../models/product_model.js"); 
const user_model = require("../models/user_model.js"); 

const router = express.Router(); 

router.post("/new",async(req,res) =>{

    try {
        
        const {image, name, price, category, description } = req.body; 

        if( !image || !name || !price || !category || !description){
            res.status(400).json({
                success:false, 
                message:"Please fill all the fields"
            }); 
        }

        else{

            const {token} = req.cookies; 

            if(!token){

                res.status(400).json({
                    success:false, 
                    message:"Not logged in"
                }); 

            }

            else{

                const decoded = jwt.verify(token, process.env.JWT_SECRET); 

                if(!decoded){

                    res.status(400).json({
                        success:false, 
                        message:"Invalid token"
                    }); 

                }

                else{

                    const user_id = decoded.token; 

                    const user = await user_model.findById(user_id);

                    if(user.is_admin === true){

                        await product_model.create({image, name, price, category, description, created_by: user._id}); 

                        res.status(201).json({
                            success:true, 
                            message:"Product created"
                        }); 

                    }

                    else{

                        res.status(400).json({
                            success:false, 
                            message:"Only admins are allowed to create products"
                        }); 

                    }

                }

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

router.get("/all",async(req,res) =>{

    try {
        
        const products = await product_model.find(); 
        res.status(200).json({
            success:true, 
            products
        })

    } catch (error) {
        console.log(error); 
    }

}); 

router.get("/search",async(req,res) =>{

    try {
        
        const {query} = req.query; 

        if(!query){
            res.status(400).json({
                success:false, 
                message:"Please provide a valid search term"
            }); 
        }

        else{

            const products = await product_model.find({name: { $regex: query, $options: "i" } }); 

            if(!products){
                res.status(400).json({
                    success:false, 
                    message:"No product found"
                }); 
            }

            else{

                res.status(200).json({
                    success:true, 
                    products
                }); 

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

router.put("/update/:id",async(req,res) =>{
    
    try {

        const {url, name, price, category, description} = req.body; 

        if( !url || !name || !price || !category || !description) {
            res.status(400).json({
                success:false, 
                message:"Please fill all the fields"
            }); 
        }

        else{

            const {id} = req.params; 

            let product = await product_model.findById(id); 
    
            if(!product){
                res.status(400).json({
                    success:false, 
                    message:"Invalid id or product does not exists"
                }); 
            }

            else{

                const {token} = req.cookies; 

                if(!token){
                    res.status(400).json({
                        success:false, 
                        message:"Not logged in"
                    }); 
                }

                else{

                    const decoded = jwt.verify(token,process.env.JWT_SECRET); 

                    if(!decoded){
                        res.status(400).json({
                            success:false, 
                            message:"Invalid token"
                        }); 
                    }

                    else{
                        const user_id = decoded.token; 

                        const user = await user_model.findById(user_id); 

                        if(user.is_admin === true){

                            product = await product_model.findByIdAndUpdate(id, {url, name, price, category, description}, {new:true, useFindAndModify: true, runValidators: true}); 

                            res.status(200).json({
                            success:true, 
                            message:"Product updated ", 
                            product
                            }); 

                        }

                        else{
                            res.status(400).json({
                                success:false, 
                                message:"Only admins are allowed to update product"
                            })
                        }
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
        
        const {token} = req.cookies; 

        if(!token){
            res.status(400).json({
                success:false, 
                message:"Not logged in"
            }); 
        }

        else{

            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            if(!decoded){

                res.status(400).json({
                    success:false, 
                    message:"Invalid token"
                }); 

            }

            else{

                const user_id = decoded.token; 

                const user = await user_model.findById(user_id); 

                if(user.is_admin === true){

                    const {id} = req.params; 

                    if(!id){

                        res.status(400).json({
                            success:false, 
                            message:"Please enter product id"
                        }); 

                    }

                    else{

                        let product = await product_model.findById(id); 

                        if(!product){

                            res.status(400).json({
                                success:false, 
                                message:"Product not found"
                            }); 

                        }

                        else{

                            await product.deleteOne(); 
                            res.status(200).json({
                                success:true, 
                                message:"Product deleted"
                            });

                        }

                    } 

                }

                else{

                    res.status(400).json({
                        success:false, 
                        message:"Only admins are allowed to delete products"
                    }); 

                }

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

router.get("/:id",async(req,res) =>{

    try {
        
        const {id} = req.params; 

        const product = await product_model.findById(id); 

        if(!product){
            res.status(400).json({
                success:false, 
                message:"Invalid product id"
            }); 
        }

        else{
            res.status(200).json({
                success:true, 
                product
            }); 
        }

    } catch (error) {
        console.log(error); 
    }

}); 

module.exports = router; 