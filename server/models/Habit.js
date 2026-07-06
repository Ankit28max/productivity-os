const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '🌱', // Emoji symbol
    },
    color: {
      type: String,
      default: 'cyan', // Visual theme mapping
    },
    history: [
      {
        type: String, // Array of YYYY-MM-DD strings of completion
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', HabitSchema);
