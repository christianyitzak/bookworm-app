import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  try {
    const { email, username, password } = req.body;
  } catch (error) {

  }
});

router.post("/login", (req, res) => {
  res.send("login");
});

export default router;