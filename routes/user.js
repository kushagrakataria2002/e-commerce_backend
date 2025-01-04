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

                        const token = jwt.sign({ token: user._id }, process.env.JWT_SECRET, { noTimestamp: true });

                        res.status(200).json({
                            success: true,
                            message: `Welcome ${user.username}`,
                            token
                        })
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
        const token = req.headers["token"];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not logged in",
            });
        }

        else {

            const jwt_token = token.split(" ")[1];

            if (!jwt_token) {
                res.status(400).json({
                    success: false,
                    message: "Token is not valid"
                });
            }

            const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);

            const user_id = decoded.token;

            const user = await user_model.findById(user_id).select("-password"); // this will not send password as a response

            res.status(200).json({
                success: true,
                user
            })

        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router; 