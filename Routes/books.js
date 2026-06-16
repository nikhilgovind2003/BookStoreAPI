import express from "express";
import { books } from "../data/books.js";
import { users } from "../data/users.js";
import  BookController from "../controllers/book.Controller.js";

const router = express.Router();
// // Get all books details
router.get("/", BookController.getAllBooks);

// Add new book
router.post("/", BookController.addNewBook);


// Get single book details
router.get("/:id", BookController.getSingleBookById);

// Issued books
router.get("/issued-books", BookController.getAllIssuedBooks);

// Update a book
router.put("/updatedbook/:id", BookController.updateBookById);



export default router;
