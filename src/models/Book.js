const { Schema, model, Types } = require('mongoose');

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    author: { type: Types.ObjectId, ref: 'Author', required: true }
  },
  { timestamps: true }
);

module.exports = model('Book', bookSchema);