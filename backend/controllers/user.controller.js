const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(422).json({
        message: "name, email & password is required.",
      });
    }
    const userExsits = await User.findOne({ email });

    if (userExsits) {
      res.status(409).json({
        message: "User already exists",
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const genratedPassword = await bcrypt.hash(password, salt);

    const token = await jwt.sign({ email }, "supersecret", {
      expiresIn: 60 * 60,
    });

    const createdUser = await User.create({
      name,
      email,
      password: genratedPassword,
      token,
      role: "user",
    });

    res.status(201).json({
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "email & password is required.",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const comparePassword = await bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = await jwt.sign({ email }, "supersecret", {
      expiresIn: 60 * 60,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error.",
    });
  }
};

module.exports = { signUpUser, loginUser };
