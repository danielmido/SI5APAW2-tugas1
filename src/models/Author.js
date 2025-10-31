const { Schema, model } = require('mongoose');

const authorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    bio: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate: semua buku milik author ini
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author' // field di Book
});

module.exports = model('Author', authorSchema);