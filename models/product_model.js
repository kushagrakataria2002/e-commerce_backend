const mongoose = require("mongoose"); 

const product_schema = new mongoose.Schema({

    image:[
        {
            url:{
                type:String, 
                required:true
            }
        }
    ],

    name:{
        type:String, 
        required:true
    }, 

    price:{
        type:Number, 
        required:true
    }, 

    category:{
        type:String, 
        requiured:true,
    },

    description:{
        type:String, 
        required:true, 
    },

    created_by:{
        type:String, 
        required:true
    }

}); 

const product_model = new mongoose.model("product_model",product_schema); 

module.exports = product_model; 