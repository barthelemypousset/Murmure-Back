const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  definition: { type: String, required: true },
  why: { type: String, required: true },
  keyConcept: { type: String, required: true },
  exemple: { type: String, required: true },
  exercice: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
});

const QuizzSchema = new mongoose.Schema({
  questions: { type: [QuestionSchema], required: true },
  results: { type: [String], required: true },
});  

const ChapterSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  logo: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  quiz: { type: QuizzSchema, required: true },
  flashcard: { type: FlashcardSchema, required: true },
});

const Chapter = mongoose.model("Chapters", ChapterSchema);
module.exports = Chapter;
