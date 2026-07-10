const mongoose = require('mongoose');

const StepLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Steps count cannot be negative'],
    },
    target: {
      type: Number,
      default: 10000,
      min: [1, 'Target steps must be at least 1'],
    },
    water: {
      type: Number,
      default: 0,
      min: [0, 'Water count cannot be negative'],
    },
    waterTarget: {
      type: Number,
      default: 2000, // in ml
      min: [1, 'Target water must be at least 1'],
    },
    sleep: {
      type: Number,
      default: 0,
      min: [0, 'Sleep hours cannot be negative'],
    },
    sleepTarget: {
      type: Number,
      default: 8, // in hours
      min: [1, 'Target sleep must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique log per user per date
StepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StepLog', StepLogSchema);
