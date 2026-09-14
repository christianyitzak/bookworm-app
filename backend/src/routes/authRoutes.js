import jwt from "jsonwebtoken";
import express from "express";

import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    };

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6 characters long!" });
    };

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be 3 characters long!" });
    };

    // Check user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already existed!" });
    };

    const user = new User({
      email,
      username,
      password,
      profileImage: ""
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "All field are required" });
    };

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    };

    // check password is coorect
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credential!" });
    };

    // generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

export default router;