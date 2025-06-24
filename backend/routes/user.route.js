const express = require("express");
const { signUpUser, loginUser } = require("../controllers/user.controller.js");
const userRoutes = express.Router();

//?        USER SIGN-UP
userRoutes.post("/signup", signUpUser);

//?        USER LOGIN
userRoutes.post("/login", loginUser);

module.exports = userRoutes;
