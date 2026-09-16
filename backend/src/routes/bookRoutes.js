import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

const router = express.Router();

router.post("/", async (req, res) => {
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
    });

    await newBook.save();

    res.status(201).json(newBook);

  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  };

});

export default router;