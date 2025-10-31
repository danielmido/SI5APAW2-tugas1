const Book = require('../models/Book');

exports.createBook = async (req, res, next) => {
  try {
    const { title, year, price, author } = req.body; // author = ObjectId
    const book = await Book.create({ title, year, price, author });
    const populated = await book.populate('author');
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

exports.getBooks = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};

    const books = await Book.find(filter)
      .populate('author') // ← populate relasi di list
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (err) { next(err); }
};

exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate('author');
    if (!book) return res.status(404).json({ message: 'Book tidak ditemukan' });
    res.json(book);
  } catch (err) { next(err); }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, price, author } = req.body;

    const updated = await Book.findByIdAndUpdate(
      id,
      { $set: { title, year, price, author } },
      { new: true, runValidators: true }
    ).populate('author');

    if (!updated) return res.status(404).json({ message: 'Book tidak ditemukan' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Book tidak ditemukan' });
    res.json({ message: 'Book dihapus', id });
  } catch (err) { next(err); }
};