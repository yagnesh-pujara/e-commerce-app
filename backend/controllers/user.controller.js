const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        message: "name, email & password are required.",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign({ userId: createdUser._id }, "supersecret", {
      expiresIn: "1h",
    });

    createdUser.token = token;
    await createdUser.save();

    res.status(201).json({
      message: "User created successfully.",
      data: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token,
      },
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
        message: "email & password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ userId: user._id }, "supersecret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
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
