const mongoose = require("mongoose"); 

const user_schema = new mongoose.Schema({
    username:{
        type:String, 
        required:true, 
        unique:true, 
    }, 
    email:{
        type:String, 
        required:true, 
        unique:true, 
    }, 
    password:{
        type:String, 
        required:true, 
        unique:true, 
    }, 
    is_admin:{
        type:Boolean, 
        default:false
    }
}); 

const user_collection = new mongoose.model("user_collection", user_schema); 

module.exports = user_collection; 