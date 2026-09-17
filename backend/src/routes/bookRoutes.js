import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !image || !caption || !rating) {
      return res.status(401).json({ message: "Please provide all fields!" });
    };

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      imageUrl: imageUrl,
      user: req.user._id
    });

    await newBook.save();

    res.status(201).json(newBook);

  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  };

});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find().sort({ createdAt: -1 }); //descending

    const total = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks: total,
      totalPages: Math.ceil(totalBooks / limit)
    });

  } catch (error) {
    console.log("Error in getting books", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;