const mongoose = require("mongoose");

const meditationSchema = mongoose.Schema({
  theme: {
    type: String,
    enum: ["anxiete", "sommeil", "detente"],
    required: true,
  },
  mode: {
    type: String,
    enum: ["guidee", "solo"],
    required: true,
  },
  duration: {
    type: Number,
    enum: [3, 5, 10],
    required: true,
  },

  audioUrl: {
    type: String,
    
  },

  imageUrl: String,
});

const Meditation = mongoose.model("meditations", meditationSchema);

module.exports = Meditation;
