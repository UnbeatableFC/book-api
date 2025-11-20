import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      minLength: [3, "Title must be at least 3 characters long"],
      maxLength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      minLength: [1, "Author name must be at least 1 character"],
      maxLength: [100, "Author name cannot exceed 100 characters"],
      trim: true,
    },
    year: {
      type: Number, // Year as a number for publication year
      min: [0, "Year cannot be negative"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    genre: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "Romance",
        "Thriller",
      ],
      default: "Fiction",
      required: [true, "Book genre is required"],
    },
  },
  { timestamps: true }
);

// Optional middleware example to log when genre changes
bookSchema.pre("save", function (next) {
  if (this.isModified("genre")) {
    console.log(`Book "${this.title}" changed genre to ${this.genre}`);
  }
  next();
});

export const BookModel = mongoose.model("Book", bookSchema);
