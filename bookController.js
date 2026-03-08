import Book from "../models/book.model.js";

const bookController = {
  addBook: async (req, res) => {
    const { url, title, author } = req.body;

    if (!url || !title || !author) {
      return res.status(400).send({
        msg: "All fields are required",
      });
    }
    console.log(req.user);
    const { id } = req.user;
    try {
      const checkIsAval = await Book.findOne({ where: { title: title, userId: id } });
      if (checkIsAval) {
        return res.status(200).send({ msg: "Books already exists" });
      }
      const newBook = await Book.create({
        url,
        userId: id,
        title,
        author,
      });
      res.send({ msg: "Book added successfully", book: newBook });
    } catch (error) {
      res.status(403).send({ err: error.message });
    }
  },
  getBookById: async (req, res) => {
    const { bookId } = req.params;
    const { id } = req.user;
    try {
      const singleBook = await Book.findOne({ where: { id: bookId, userId: id } });
      if (!singleBook) {
        return res.status(404).send({ msg: "Please enter a valid Id" });
      }
      res.status(200).json(singleBook);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  },
  getAllBooks: async (req, res) => {
    const { id } = req.user;
    try {
      const allBooks = await Book.findAll({ where: { userId: id } });
      if (!allBooks || allBooks.length === 0) {
        return res.status(200).send({ msg: "Empty" });
      }
      return res.status(200).json(allBooks);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  },
  updateBook: async (req, res) => {
    try {
      const bookId = req.params.bookId;

      const book = await Book.findOne({
        where: {
          id: bookId,
          userId: req.user.id
        }
      });

      if (!book) {
        return res.status(404).send({ msg: "Book not found" });
      }

      await Book.update(req.body, {
        where: { id: bookId }
      });

      res.send("Data updated successfully");

    } catch (error) {
      res.status(400).send({ Error: error.message });
    }
  },

  deleteBook: async (req, res) => {
    const { id } = req.user;
    try {
      let { bookId } = req.params;
      let book = await Book.findOne({ where: { id: bookId, userId: id } });
      if (!book) {
        return res.status(404).send({ msg: "Book not found" });
      }

      await Book.destroy({ where: { id: bookId } });
      res.status(200).send({ msg: "Book deleted successfully" });
    } catch (error) {
      res.send({ err: error.message });
    }
  },
};

export default bookController;
