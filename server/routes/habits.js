const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// @route    GET api/habits
// @desc     Get all habits of the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: habits.length,
      habits,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving habits' });
  }
});

// @route    POST api/habits
// @desc     Create a new habit
// @access   Private
router.post('/', auth, async (req, res) => {
  const { name, icon, color } = req.body;

  try {
    const newHabit = new Habit({
      userId: req.user.id,
      name,
      icon: icon || '🌱',
      color: color || 'orange',
      history: [],
    });

    const habit = await newHabit.save();
    res.json({
      success: true,
      habit,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error creating habit' });
  }
});

// @route    PUT api/habits/:id
// @desc     Update a habit
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { name, icon, color } = req.body;

  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Verify user owns the habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this habit' });
    }

    const habitFields = {};
    if (name !== undefined) habitFields.name = name;
    if (icon !== undefined) habitFields.icon = icon;
    if (color !== undefined) habitFields.color = color;

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $set: habitFields },
      { new: true }
    );

    res.json({
      success: true,
      habit,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating habit' });
  }
});

// @route    POST api/habits/:id/toggle
// @desc     Toggle a date in habit check-in history
// @access   Private
router.post('/:id/toggle', auth, async (req, res) => {
  const { date } = req.body; // Expect date in format YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required for toggle check' });
  }

  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Verify user owns the habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const index = habit.history.indexOf(date);
    if (index > -1) {
      // Remove date if already checked
      habit.history.splice(index, 1);
    } else {
      // Add date if checked off
      habit.history.push(date);
    }

    await habit.save();
    res.json({
      success: true,
      habit,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error toggling habit date' });
  }
});

// @route    DELETE api/habits/:id
// @desc     Delete a habit
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Verify user owns the habit
    if (habit.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this habit' });
    }

    await Habit.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Habit successfully removed',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error deleting habit' });
  }
});

module.exports = router;
