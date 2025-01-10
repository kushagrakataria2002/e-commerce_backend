const express = require("express");
const user_model = require("../models/user_model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {

        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }
        else {
            if (password.length < 8) {
                res.status(400).json({
                    success: false,
                    message: "Password must be of 8 characters"
                });
            }
            else {
                let user = await user_model.findOne({ email });
                if (user) {
                    res.status(400).json({
                        success: false,
                        message: "User already exist with this email. Please choose another"
                    });
                }
                else {

                    user = await user_model.findOne({ username });

                    if (user) {
                        res.status(400).json({
                            success: false,
                            message: "Please choose another username"
                        });
                    }

                    else {

                        const hashed_password = await bcrypt.hash(password, 10);

                        user = await user_model.create({ username, email, password: hashed_password });

                        res.status(201).json({
                            success: true,
                            message: "User registered",
                        });

                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        else {
            if (password.length < 8) {
                res.status(400).json({
                    success: false,
                    message: "Password must be of 8 characters"
                });
            }

            else {
                let user = await user_model.findOne({ email });

                if (!user) {
                    res.status(400).json({
                        success: false,
                        message: "User not found with current email"
                    });
                }

                else {
                    const password_matched = await bcrypt.compare(password, user.password);

                    if (!password_matched) {
                        res.status(400).json({
                            success: false,
                            message: "Incorrect password entered"
                        });
                    }

                    else {

                        const token = jwt.sign( {token : user._id},process.env.JWT_SECRET, {noTimestamp:true}); 

                        res.cookie("token", token, {httpOnly: true, secure:true, sameSite:"Strict"}); 

                        res.status(200).json({
                            success: true,
                            message: `Welcome ${user.username}`
                        }); 
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
});

router.get("/profile", async (req, res) => {

    try {
        
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

                res.status(200).json({
                    success:true, 
                    username:user.username,
                    email:user.email
                }); 

            }

        }

    } catch (error) {
        console.log(error); 
    }
});

router.post("/logout", async(req,res) =>{

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

                res.status(400).josn({
                    success:false, 
                    message:"Invalid token"
                }); 

            }

            else{

                res.clearCookie("token",{httpOnly: true, secure: true, sameSite: "none"}); 

                res.status(200).json({
                    success:true, 
                    message:"Logged out"
                }); 

            }

        }

    } catch (error) {
        console.log(error); 
    }

}); 

module.exports = router; 