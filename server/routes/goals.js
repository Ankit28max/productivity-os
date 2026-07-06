const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

// @route    GET api/goals
// @desc     Get all goals of the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving goals' });
  }
});

// @route    POST api/goals
// @desc     Create a new goal
// @access   Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, targetDate, milestones } = req.body;

  try {
    const newGoal = new Goal({
      userId: req.user.id,
      title,
      description,
      category,
      targetDate,
      milestones: milestones || [],
    });

    const goal = await newGoal.save();
    res.json({
      success: true,
      goal,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error creating goal' });
  }
});

// @route    PUT api/goals/:id
// @desc     Update a goal
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, targetDate, milestones } = req.body;

  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Verify user owns the goal
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this goal' });
    }

    const goalFields = {};
    if (title !== undefined) goalFields.title = title;
    if (description !== undefined) goalFields.description = description;
    if (category !== undefined) goalFields.category = category;
    if (targetDate !== undefined) goalFields.targetDate = targetDate;
    if (milestones !== undefined) goalFields.milestones = milestones;

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );

    res.json({
      success: true,
      goal,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating goal' });
  }
});

// @route    POST api/goals/:id/milestone/:mId/toggle
// @desc     Toggle completion status of a goal sub-milestone
// @access   Private
router.post('/:id/milestone/:mId/toggle', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Verify user owns the goal
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Find the sub-milestone
    const milestone = goal.milestones.id(req.params.mId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    // Toggle completion status
    milestone.completed = !milestone.completed;
    await goal.save();

    res.json({
      success: true,
      goal,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error toggling milestone' });
  }
});

// @route    DELETE api/goals/:id
// @desc     Delete a goal
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Verify user owns the goal
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this goal' });
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Goal successfully removed',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error deleting goal' });
  }
});

module.exports = router;
