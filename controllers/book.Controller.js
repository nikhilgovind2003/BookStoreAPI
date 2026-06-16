import { bookModel, userModel } from "../models/index.js";
import IssuedBook from "../dto/books.dto.js";


class BookController {

static getAllBooks = async (req, res) => {
  const books = await bookModel.find();

  if (books.length === 0) {
    return res.json({
      succes: false,
      message: "No books found",
    });
  }
  res.status(200).json({
    succes: true,
    message: "Get all the books",
    data: books,
  });
};

static getSingleBookById = async (req, res) => {
  const { id } = req.params;
  const book = await bookModel.findById(id);

  if (!book)
    return res.status(404).json({
      succes: false,
      message: `Book with this id not found at id: ${id}`,
    });

  return res.status(200).json({
    succes: true,
    message: `Book is found at id:${id}`,
    data: book,
  });
};

static getAllIssuedBooks = async (req, res) => {
  
  const users = await userModel
    .find({ issuedBook: { $exsist: true } })
    .populate("issuedBook");

  const issuedBook = users.map((each) => new IssuedBook(each));

  if (issuedBook.length === 0) {
    return res.status(404).json({
      succes: false,
      message: "No books issued by user!",
    });
  }
  res.status(200).json({
    succes: true,
    message: "Book issued by user found!!!",
    data: issuedBook,
  });
};

static addNewBook = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    res.status(404).json({
      succes: false,
      message: "Enter all details",
    });
  }

  await bookModel.create(data);
  const addBooks = await bookModel.find();

  return res.status(200).json({
    succes: true,
    message: "Book added successfully",
    data: addBooks,
  });
};

static updateBookById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!data) {
    
  return res.status(200).json({
    succes: false,
    message: "Not blanks allowed",
  });
  }



  // checking book is exists or not
  const updatedBook = await bookModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
 
  return res.status(200).json({
    succes: true,
    message: "Book details updated successfully!",
    data: updatedBook,
  });
};
}


export default BookController;