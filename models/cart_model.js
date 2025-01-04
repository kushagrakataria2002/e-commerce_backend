const mongoose = require("mongoose"); 

const cart_schema = new mongoose.Schema({

    image:{
        type:String, 
        required:true
    }, 

    name:{
        type:String, 
        required:true
    }, 

    price:{
        type:Number, 
        required:true
    }, 

    quantity:{
        type:Number, 
        required:true,
    },

    created_by:{
        type:String, 
        required:true
    }

}); 

const cart_model = new mongoose.model("cart_model",cart_schema); 

module.exports = cart_model; 