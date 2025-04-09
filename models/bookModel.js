import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify a category']
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price']
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    publishedDate: {
      type: Date,
      required: [true, 'Please specify the published date']
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;
