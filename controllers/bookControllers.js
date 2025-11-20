import { BookModel } from "../models/BookModel.js";



export const getAllBooks = async (req, res, next) => {
  try {
    const { author, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (author) {
      filter.author = { $regex: author, $options: "i" }; // Case-insensitive match
    }

    // Convert page and limit to numbers and apply pagination calculation
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination metadata
    const totalDocuments = await BookModel.countDocuments(filter);

    // Query filtered and paginated results
    const books = await BookModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ title: 1 }); // Optional: sort alphabetically by title

    res.status(200).json({
      success: true,
      count: books.length,
      total: totalDocuments,
      page: pageNum,
      pages: Math.ceil(totalDocuments / limitNum),
      data: books,
    });
  } catch (error) {
    next(error);
  }
};


export const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("Book ID is required"), {
        statusCode: 400,
      });

    const book = await BookModel.findById(id);
    if (!book)
      throw Object.assign(new Error("Book not found"), {
        statusCode: 404,
      });

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

export const createNewBook = async (req, res, next) => {
  try {
    const { title, author, year, genre } = req.body;
    const book = await BookModel.create({
      title,
      author,
      year,
      genre,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("Book ID is required"), {
        statusCode: 400,
      });

    const updates = req.body;
    const book = await BookModel.findById(id);
    if (!book)
      throw Object.assign(new Error("Book not found"), {
        statusCode: 404,
      });

    // Genre validation, 
    const validGenres = [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Science Fiction",
      "Fantasy",
      "Biography",
      "Romance",
      "Thriller",
    ];
    if (updates.genre && !validGenres.includes(updates.genre)) {
      throw Object.assign(new Error("Invalid book genre"), {
        statusCode: 400,
      });
    }

    Object.assign(book, updates);
    await book.save();

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("Book ID is required"), {
        statusCode: 400,
      });

    const book = await BookModel.findByIdAndDelete(id);
    if (!book)
      throw Object.assign(new Error("Book not found"), {
        statusCode: 404,
      });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
