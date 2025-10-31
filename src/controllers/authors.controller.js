const Author = require('../models/Author');

exports.createAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    const exists = await Author.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email author sudah terdaftar' });

    const author = await Author.create({ name, email, bio });
    res.status(201).json(author);
  } catch (err) { next(err); }
};

exports.getAuthors = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, withBooks } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};

    const docs = await Author.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // opsional: sertakan virtual books (butuh separate fetch/lean+populateVirtuals)
    if (withBooks === 'true') {
      const populated = await Author.find({ _id: { $in: docs.map(d => d._id) } })
        .populate('books')
        .sort({ createdAt: -1 });
      return res.json(populated);
    }

    res.json(docs);
  } catch (err) { next(err); }
};

exports.getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { populate: pop } = req.query; // ?populate=books

    let query = Author.findById(id);
    if (pop === 'books') query = query.populate('books');

    const author = await query;
    if (!author) return res.status(404).json({ message: 'Author tidak ditemukan' });

    res.json(author);
  } catch (err) { next(err); }
};

exports.updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    const updated = await Author.findByIdAndUpdate(
      id,
      { $set: { name, email, bio } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Author tidak ditemukan' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Author.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Author tidak ditemukan' });
    res.json({ message: 'Author dihapus', id });
  } catch (err) { next(err); }
};