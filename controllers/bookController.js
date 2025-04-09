import Book from '../models/bookModel.js';

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res) => {
    try {
        const { title, author, category, price, rating, publishedDate } = req.body;

        const book = await Book.create({
            title,
            author,
            category,
            price,
            rating,
            publishedDate,
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all books with filtering, search, pagination, and sorting
// @route   GET /api/books
// @access  Private
export const getAllBooks = async (req, res) => {
    try {
        const { author, category, rating, title, sortBy, page = 1, limit = 10 } = req.query;

        const query = {};

        if (author) query.author = author;
        if (category) query.category = category;
        if (rating) query.rating = { $gte: Number(rating) };
        if (title) query.title = { $regex: title, $options: 'i' };

        const sortOptions = {};
        if (sortBy === 'price') sortOptions.price = 1;
        if (sortBy === 'rating') sortOptions.rating = -1;

        const books = await Book.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update book by ID
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete book by ID
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.deleteOne();

        res.status(200).json({ message: 'Book removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
