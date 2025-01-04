const mongoose = require("mongoose"); 

mongoose.connect("mongodb+srv://kushagra_kataria:hello1234@cluster0.avfati0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() =>{
    console.log(`mongo db is connected successfully`); 
}).catch((err) =>{
    console.log(err); 
})